import { ChangeDetectionStrategy, Component, computed, effect, inject, OnInit, signal, untracked } from '@angular/core';
import { toSignal } from '@angular/core/rxjs-interop';
import { RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';
import { SeoService } from '@app/services/seo.service';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import {
  CATEGORY_OPTIONS,
  ContactCategory,
  ContactForm,
  ContactTopic,
  TOPIC_OPTIONS,
} from '@app/shared/forms/form-pages/contact-form/contact-form-models';
import { FormSentInfoComponent } from '@app/shared/forms/components/form-sent-info/form-sent-info.component';
import { ScrollToFirstErrorDirective } from '@app/shared/forms/directives/scroll-to-first-error.directive';
import { FormErrorService } from '@app/shared/forms/services/form-error.service';

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
  ],
  styleUrl: '../../forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FormErrorService],
})
export class ContactFormComponent implements OnInit {
  private readonly seoService = inject(SeoService);
  private readonly formErrorService = inject(FormErrorService);

  readonly topicOptions = TOPIC_OPTIONS;

  readonly mainForm = new FormGroup<ContactForm>({
    topic: new FormControl<ContactTopic | null>(null, Validators.required),
    category: new FormControl<ContactCategory | null>({ value: null, disabled: true }, Validators.required),
  });

  private readonly topicValue = toSignal(this.mainForm.controls.topic.valueChanges, {
    initialValue: this.mainForm.controls.topic.value,
  });

  readonly isFormSent = signal(false);
  readonly isErrorOnSubmit = signal(false);
  readonly errorMessages = this.formErrorService.errorMessages;
  readonly shouldShowErrorAlert = computed(() => this.isErrorOnSubmit() && !this.isFormSent());
  readonly showCategoryField = computed(() => {
    const topic = this.topicValue();
    return !topic || !!CATEGORY_OPTIONS[topic];
  });
  readonly filteredCategoryOptions = computed(() => {
    const topic = this.topicValue();
    return CATEGORY_OPTIONS[topic] ?? [];
  });

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

  ngOnInit(): void {
    this.seoService.setPageTitleByTranslationKey(['Forms.PageHeader.Heading.Contact']);
  }

  onFormSubmit(): void {
    if (!this.mainForm.valid) {
      return;
    }

    this.isFormSent.set(true);
  }
}
