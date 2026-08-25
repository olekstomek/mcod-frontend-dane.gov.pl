import { Component, inject, signal, ChangeDetectionStrategy, OnInit, computed } from '@angular/core';
import { FormGroup, ReactiveFormsModule } from '@angular/forms';
import { NameEmailFormPartComponent } from '@app/shared/forms/form-parts/name-email-form-part/name-email-form-part.component';
import { PoCoToFieldsFormPartComponent } from '@app/shared/forms/form-parts/po-co-to-fields-form-part/po-co-to-fields-form-part.component';
import { TranslatePipe } from '@ngx-translate/core';
import { FormSentInfoComponent } from '@app/shared/forms/components/form-sent-info/form-sent-info.component';
import { PoCoToForm } from '@app/shared/forms/form-pages/po-co-to-form/po-co-to-form-models';
import { PoCoToFormFacade } from '@app/shared/forms/form-pages/po-co-to-form/po-co-to-form-facade';
import { RouterLink } from '@angular/router';
import { SeoService } from '@app/services/seo.service';
import { FormErrorService } from '@app/shared/forms/services/form-error.service';
import { ScrollToFirstErrorDirective } from '@app/shared/forms/directives/scroll-to-first-error.directive';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';

@Component({
  selector: 'app-po-co-to-form',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    NameEmailFormPartComponent,
    PoCoToFieldsFormPartComponent,
    TranslatePipe,
    FormSentInfoComponent,
    RouterLink,
    ScrollToFirstErrorDirective,
    LocalizeRouterPipe,
  ],
  templateUrl: './po-co-to-form.component.html',
  styleUrl: '../../forms.scss',
  providers: [PoCoToFormFacade, FormErrorService],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoCoToFormComponent implements OnInit {
  private readonly poCoToFormFacade = inject(PoCoToFormFacade);
  private readonly seoService = inject(SeoService);
  private readonly formErrorService = inject(FormErrorService);

  readonly isFormSent = signal(false);
  readonly isErrorOnSubmit = signal(false);
  readonly errorMessages = this.formErrorService.errorMessages;
  readonly shouldShowErrorAlert = computed(() => this.isErrorOnSubmit() && !this.isFormSent());

  readonly mainForm = new FormGroup<PoCoToForm>({});

  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Forms.PageHeader.Heading.PoCoTo']);
  }

  onFormSubmit(): void {
    if (!this.mainForm.valid) {
      return;
    }

    this.poCoToFormFacade.submitForm(this.mainForm.getRawValue()).subscribe({
      next: () => this.isFormSent.set(true),
      error: (error) => {
        this.isErrorOnSubmit.set(true);
        this.formErrorService.getErrorMessages(error);
        window.scrollTo({ top: 0, behavior: 'smooth' });
      },
    });
  }
}
