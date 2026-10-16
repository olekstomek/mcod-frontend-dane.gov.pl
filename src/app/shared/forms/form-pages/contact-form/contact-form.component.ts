import {
  ChangeDetectionStrategy,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  OnInit,
  signal,
  untracked,
  ViewChild,
} from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';
import { SeoService } from '@app/services/seo.service';
import {
  FormControl,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import {
  ApiMap,
  CATEGORY_OPTIONS,
  ContactCategory,
  ContactForm,
  ContactTopic,
  TOPIC_OPTIONS,
} from '@app/shared/forms/form-pages/contact-form/contact-form-models';
import { FormSentInfoComponent } from '@app/shared/forms/components/form-sent-info/form-sent-info.component';
import { ScrollToFirstErrorDirective } from '@app/shared/forms/directives/scroll-to-first-error.directive';
import { scrollToFirstError } from '@app/shared/forms/utils/scroll-to-first-error';
import { FormErrorService } from '@app/shared/forms/services/form-error.service';
import { FormSuggestDatasetFieldsComponent } from '@app/shared/forms/form-parts/suggest-dataset-form-part/suggest-dataset-form-part.component';
import { SuggestDatasetFormFacade } from '@app/shared/forms/form-pages/suggest-dataset-form/suggest-dataset-form-facade';
import { FeedbackFieldsFormPartComponent } from '@app/shared/forms/form-parts/feedback-fields-form-part/feedback-fields-form-part.component';
import { FeedbackFormFacade } from '@app/shared/forms/form-pages/feedback-form/feedback-form-facade';
import { NameEmailFormPartComponent } from '@app/shared/forms/form-parts/name-email-form-part/name-email-form-part.component';
import { MathCaptchaComponent } from '@app/shared/math-captcha/math-captcha.component';
import { HttpErrorResponse } from '@angular/common/http';
import { throwError } from 'rxjs';
import { PoCoToFieldsFormPartComponent } from '@app/shared/forms/form-parts/po-co-to-fields-form-part/po-co-to-fields-form-part.component';
import { PoCoToFormFacade } from '@app/shared/forms/form-pages/po-co-to-form/po-co-to-form-facade';
import { GenericFormPartComponent } from '@app/shared/forms/form-parts/generic-form-part/generic-form-part.component';
import { ContactFormFacade } from '@app/shared/forms/form-pages/contact-form/contact-form-facade';

@Component({
  selector: 'app-contact-form',
  templateUrl: './contact-form.component.html',
  standalone: true,
  imports: [
    TranslatePipe,
    RouterLink,
    LocalizeRouterPipe,
    ReactiveFormsModule,
    FormSentInfoComponent,
    ScrollToFirstErrorDirective,
    FormSuggestDatasetFieldsComponent,
    FeedbackFieldsFormPartComponent,
    NameEmailFormPartComponent,
    MathCaptchaComponent,
    PoCoToFieldsFormPartComponent,
    GenericFormPartComponent,
  ],
  styleUrl: '../../forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [
    FormErrorService,
    SuggestDatasetFormFacade,
    FeedbackFormFacade,
    PoCoToFormFacade,
    ContactFormFacade,
  ],
})
export class ContactFormComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly formErrorService = inject(FormErrorService);
  private readonly suggestDatasetFormFacade = inject(SuggestDatasetFormFacade);
  private readonly feedbackFormFacade = inject(FeedbackFormFacade);
  private readonly poCoToFormFacade = inject(PoCoToFormFacade);
  private readonly contactFormFacade = inject(ContactFormFacade);

  @ViewChild('contactForm')
  private readonly contactFormRef?: ElementRef<HTMLFormElement>;

  private apiMap: ApiMap = {
    [ContactCategory.SuggestData]: ({ nameEmail, suggestDatasetFields }) =>
      nameEmail && suggestDatasetFields
        ? this.suggestDatasetFormFacade.submitForm({
            nameEmail,
            suggestDatasetFields,
          })
        : throwError(() => new Error('Missing suggestDatasetFields form data')),
    [ContactCategory.DataFeedback]: ({ nameEmail, feedbackFields }) =>
      nameEmail && feedbackFields
        ? this.feedbackFormFacade.submitForm({ nameEmail, feedbackFields })
        : throwError(() => new Error('Missing feedbackFields form data')),
    [ContactCategory.SuggestReuse]: ({ nameEmail, poCoToFields }) =>
      nameEmail && poCoToFields
        ? this.poCoToFormFacade.submitForm({ nameEmail, poCoToFields })
        : throwError(() => new Error('Missing poCoToFields form data')),
  };

  protected readonly ContactCategory = ContactCategory;
  readonly topicOptions = TOPIC_OPTIONS;

  readonly mainForm = new FormGroup<ContactForm>({
    topic: new FormControl<ContactTopic | null>(null, Validators.required),
    category: new FormControl<ContactCategory | null>(
      { value: null, disabled: true },
      Validators.required,
    ),
    captcha: new FormControl(null, Validators.required),
  });

  private readonly topicValue = toSignal(
    this.mainForm.controls.topic.valueChanges,
    {
      initialValue: this.mainForm.controls.topic.value,
    },
  );
  private readonly categoryValue = toSignal(
    this.mainForm.controls.category.valueChanges,
    {
      initialValue: this.mainForm.controls.category.value,
    },
  );

  readonly isFormSent = signal(false);
  readonly isErrorOnSubmit = signal(false);
  readonly isSubmitting = signal(false);
  readonly showSlowUploadHint = signal(false);
  readonly errorMessages = this.formErrorService.errorMessages;
  readonly shouldShowErrorAlert = computed(
    () => this.isErrorOnSubmit() && !this.isFormSent(),
  );
  readonly showCategoryField = computed(() => {
    const topic = this.topicValue();
    return !topic || !!CATEGORY_OPTIONS[topic];
  });
  readonly filteredCategoryOptions = computed(() => {
    const topic = this.topicValue();
    return CATEGORY_OPTIONS[topic] ?? [];
  });
  readonly showFormParts = computed(() => {
    const topic = this.topicValue();
    const category = this.categoryValue();
    return !!topic && (!CATEGORY_OPTIONS[topic] || !!category);
  });
  readonly showPrivacyPolicy = computed(
    () => this.categoryValue() !== ContactCategory.SuggestReuse,
  );
  private readonly syncCategoryFieldState = effect(() => {
    const topic = this.topicValue();
    const categoryControl = this.mainForm.controls.category;

    untracked(() => {
      categoryControl.reset();
      if (!CATEGORY_OPTIONS[topic]) {
        categoryControl.disable();
      } else {
        categoryControl.enable();
      }
    });
  });

  private readonly slowUploadHintEffect = effect((onCleanup) => {
    const isSubmitting = this.isSubmitting();

    untracked(() => this.showSlowUploadHint.set(false));

    if (isSubmitting) {
      const timer = setTimeout(
        () => untracked(() => this.showSlowUploadHint.set(true)),
        10000,
      );
      onCleanup(() => clearTimeout(timer));
    }
  });

  ngOnInit(): void {
    this.seoService.setPageTitleByTranslationKey([
      'Forms.PageHeader.Heading.Contact',
    ]);
  }

  onFormSubmit(): void {
    if (!this.mainForm.valid) {
      return;
    }
    const formData = this.mainForm.getRawValue();
    const apiCallFn = formData.category
      ? this.apiMap[formData.category]
      : undefined;
    const call$ = apiCallFn
      ? apiCallFn(formData)
      : this.contactFormFacade.submitForm(formData);

    this.isSubmitting.set(true);

    call$.subscribe({
      next: () => {
        this.isSubmitting.set(false);
        this.isFormSent.set(true);
      },
      error: (error: HttpErrorResponse) => {
        this.isSubmitting.set(false);

        if (
          formData.category === ContactCategory.DataFeedback &&
          error.status === 404
        ) {
          this.markFeedbackLinkAsNotFound();
          return;
        }

        this.isErrorOnSubmit.set(true);
        this.formErrorService.getErrorMessages(error);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  }

  private markFeedbackLinkAsNotFound(): void {
    const linkControl = this.mainForm.controls.feedbackFields?.controls.link;
    if (!linkControl) {
      return;
    }

    linkControl.setErrors({ notFound: true });
    linkControl.markAsTouched();

    if (this.contactFormRef) {
      scrollToFirstError(this.contactFormRef.nativeElement);
    }
  }
}
