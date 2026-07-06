import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { ScrollbarWidthDirective } from '@app/shared/forms/directives/scrollbar-width.directive';
import { SuggestDatasetFieldsForm } from '@app/shared/forms/form-parts/suggest-dataset-form-part/suggest-dataset-form-part-models';
import {
  linkInputLength,
  linkPattern,
  maxDescriptionLength,
  standardInputLength,
} from '@app/shared/forms/form-variables';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-suggest-dataset-form-part',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, ScrollbarWidthDirective],
  templateUrl: './suggest-dataset-form-part.component.html',
  styleUrl: '../../forms.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSuggestDatasetFieldsComponent implements OnInit, OnDestroy {
  private parentFormDirective = inject(FormGroupDirective);

  suggestDatasetFieldsGroup = new FormGroup<SuggestDatasetFieldsForm>({
    nameOfData: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(standardInputLength)],
    }),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(maxDescriptionLength)],
    }),
    institution: new FormControl('', {
      nonNullable: true,
      validators: Validators.maxLength(standardInputLength),
    }),
    foundLink: new FormControl('', {
      nonNullable: true,
      validators: [Validators.maxLength(linkInputLength), Validators.pattern(linkPattern)],
    }),
    potentialUses: new FormControl('', {
      nonNullable: true,
      validators: Validators.maxLength(standardInputLength),
    }),
  });

  ngOnInit() {
    this.parentFormDirective.form.addControl('suggestDatasetFields', this.suggestDatasetFieldsGroup);
  }

  ngOnDestroy() {
    this.parentFormDirective.form.removeControl('suggestDatasetFields');
  }
}
