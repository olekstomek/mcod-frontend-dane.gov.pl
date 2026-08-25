import { Component, OnInit, OnDestroy, inject, ChangeDetectionStrategy, effect } from '@angular/core';
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
import { toSignal } from '@angular/core/rxjs-interop';
import { map } from 'rxjs/operators';
import { ActivatedRoute } from '@angular/router';
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
  private readonly route = inject(ActivatedRoute);

  readonly datasetUrl = toSignal(this.route.queryParamMap.pipe(map((params) => params.get('datasetUrl') ?? '')), {
    initialValue: '',
  });

  private readonly datasetUrlEffect = effect(() => {
    this.feedbackFieldsGroup.patchValue({ link: this.datasetUrl() });
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
