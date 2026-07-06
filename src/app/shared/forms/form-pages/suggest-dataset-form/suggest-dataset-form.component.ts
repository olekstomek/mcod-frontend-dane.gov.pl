import { ChangeDetectionStrategy, Component, computed, inject, OnInit, signal } from '@angular/core';
import { FormControl, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { SuggestDatasetForm } from '@app/shared/forms/form-pages/suggest-dataset-form/suggest-dataset-form-model';
import { NameEmailFormPartComponent } from '@app/shared/forms/form-parts/name-email-form-part/name-email-form-part.component';
import { FormSuggestDatasetFieldsComponent } from '@app/shared/forms/form-parts/suggest-dataset-form-part/suggest-dataset-form-part.component';
import { MathCaptchaComponent } from '@app/shared/math-captcha/math-captcha.component';
import { TranslatePipe } from '@ngx-translate/core';
import { SuggestDatasetFormFacade } from '@app/shared/forms/form-pages/suggest-dataset-form/suggest-dataset-form-facade';
import { FormSentInfoComponent } from '@app/shared/forms/components/form-sent-info/form-sent-info.component';
import { RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { SeoService } from '@app/services/seo.service';
import { FormErrorService } from '@app/shared/forms/services/form-error.service';
import { ScrollToFirstErrorDirective } from '@app/shared/forms/directives/scroll-to-first-error.directive';

@Component({
  selector: 'app-suggest-dataset-form',
  standalone: true,
  imports: [
    TranslatePipe,
    ReactiveFormsModule,
    NameEmailFormPartComponent,
    MathCaptchaComponent,
    FormSuggestDatasetFieldsComponent,
    FormSentInfoComponent,
    RouterLink,
    LocalizeRouterPipe,
    ScrollToFirstErrorDirective,
  ],
  templateUrl: './suggest-dataset-form.component.html',
  styleUrl: '../../forms.scss',
  providers: [SuggestDatasetFormFacade, FormErrorService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class SuggestDatasetFormComponent implements OnInit {
  private readonly suggestDatasetFormFacade = inject(SuggestDatasetFormFacade);
  private readonly seoService = inject(SeoService);
  private readonly formErrorService = inject(FormErrorService);

  isFormSent = signal(false);
  isErrorOnSubmit = signal(false);
  errorMessages = this.formErrorService.errorMessages;
  shouldShowErrorAlert = computed(() => this.isErrorOnSubmit() && !this.isFormSent());

  mainForm = new FormGroup<SuggestDatasetForm>({
    captcha: new FormControl(null, Validators.required),
  });

  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Forms.PageHeader.Heading.NewData']);
  }

  onFormSubmit(): void {
    if (!this.mainForm.valid) {
      return;
    }

    this.suggestDatasetFormFacade.submitForm(this.mainForm.getRawValue()).subscribe({
      next: () => this.isFormSent.set(true),
      error: (error) => {
        this.isErrorOnSubmit.set(true);
        this.formErrorService.getErrorMessages(error);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  }
}
