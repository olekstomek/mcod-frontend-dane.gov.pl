import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, effect, input } from '@angular/core';
import {
  ControlContainer,
  FormGroupDirective,
  ReactiveFormsModule,
  FormGroup,
  FormControl,
  Validators,
} from '@angular/forms';
import { FeedbackFieldsForm } from '@app/shared/forms/form-parts/feedback-fields-form-part/feedback-fields-models';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollbarWidthDirective } from '@app/shared/forms/directives/scrollbar-width.directive';
import { linkInputLength, maxDescriptionLength } from '@app/shared/forms/form-variables';
import { datasetOrResourceLinkValidator } from '@app/shared/forms/form-validators';

@Component({
  selector: 'app-feedback-fields-form-part',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, ScrollbarWidthDirective],
  templateUrl: './feedback-fields-form-part.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  styleUrl: '../../forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FeedbackFieldsFormPartComponent implements OnInit, OnDestroy {
  private readonly parentFormDirective = inject(FormGroupDirective);

  readonly preselectedLink = input<string | null>(null);

  private readonly preselectedLinkEffect = effect(() => {
    const link = this.preselectedLink();
    if (link) {
      this.feedbackFieldsGroup.patchValue({ link });
    }
  });

  readonly feedbackFieldsGroup = new FormGroup<FeedbackFieldsForm>({
    link: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(linkInputLength), datasetOrResourceLinkValidator],
    }),
    description: new FormControl<string>('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(maxDescriptionLength)],
    }),
  });

  ngOnInit() {
    this.parentFormDirective.form.addControl('feedbackFields', this.feedbackFieldsGroup);
  }

  ngOnDestroy() {
    this.parentFormDirective.form.removeControl('feedbackFields');
  }
}
