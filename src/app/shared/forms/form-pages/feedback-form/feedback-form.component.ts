import { Component, signal, inject, ChangeDetectionStrategy, computed, OnInit } from '@angular/core';
import { Location } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { FormSentInfoComponent } from '@app/shared/forms/components/form-sent-info/form-sent-info.component';
import { FormsModule, FormGroup, ReactiveFormsModule, FormControl, Validators } from '@angular/forms';
import { NameEmailFormPartComponent } from '@app/shared/forms/form-parts/name-email-form-part/name-email-form-part.component';
import { TranslatePipe } from '@ngx-translate/core';
import { FeedbackForm } from '@app/shared/forms/form-pages/feedback-form/feedback-form-models';
import { FeedbackFieldsFormPartComponent } from '@app/shared/forms/form-parts/feedback-fields-form-part/feedback-fields-form-part.component';
import { MathCaptchaComponent } from '@app/shared/math-captcha/math-captcha.component';
import { FeedbackFormFacade } from '@app/shared/forms/form-pages/feedback-form/feedback-form-facade';
import { SeoService } from '@app/services/seo.service';
import { FormErrorService } from '@app/shared/forms/services/form-error.service';
import { ScrollToFirstErrorDirective } from '@app/shared/forms/directives/scroll-to-first-error.directive';

@Component({
  selector: 'app-feedback-form',
  standalone: true,
  imports: [
    FormSentInfoComponent,
    FormsModule,
    NameEmailFormPartComponent,
    TranslatePipe,
    ReactiveFormsModule,
    FeedbackFieldsFormPartComponent,
    MathCaptchaComponent,
    RouterLink,
    LocalizeRouterPipe,
    ScrollToFirstErrorDirective,
  ],
  templateUrl: './feedback-form.component.html',
  styleUrl: '../../forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  providers: [FeedbackFormFacade, FormErrorService],
})
export class FeedbackFormComponent implements OnInit {
  private readonly feedbackFormFacade = inject(FeedbackFormFacade);
  private readonly seoService = inject(SeoService);
  private readonly location = inject(Location);
  private readonly route = inject(ActivatedRoute);
  private readonly formErrorService = inject(FormErrorService);

  readonly datasetUrl = toSignal(this.route.queryParamMap.pipe(map((params) => params.get('datasetUrl'))), {
    initialValue: null,
  });

  readonly datasetPathname = computed(() => {
    const raw = this.datasetUrl();
    return raw ? new URL(raw).pathname : null;
  });

  readonly isFormSent = signal(false);
  readonly isErrorOnSubmit = signal(false);
  readonly errorMessages = this.formErrorService.errorMessages;
  readonly shouldShowErrorAlert = computed(() => this.isErrorOnSubmit() && !this.isFormSent());

  readonly mainForm = new FormGroup<FeedbackForm>({
    captcha: new FormControl(null, Validators.required),
  });

  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Forms.PageHeader.Heading.Feedback']);
  }

  onFormSubmit(): void {
    if (!this.mainForm.valid) {
      return;
    }

    const { nameEmail, feedbackFields } = this.mainForm.getRawValue();
    this.feedbackFormFacade.submitForm({ nameEmail, feedbackFields }).subscribe({
      next: () => this.isFormSent.set(true),
      error: (error) => {
        this.isErrorOnSubmit.set(true);
        this.formErrorService.getErrorMessages(error);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  }

  goBack(event?: MouseEvent): void {
    event?.preventDefault();
    this.location.back();
  }
}
