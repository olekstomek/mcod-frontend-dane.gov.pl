import { ChangeDetectionStrategy, Component, inject, OnDestroy, OnInit } from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollbarWidthDirective } from '@app/shared/forms/directives/scrollbar-width.directive';
import { maxDescriptionLength } from '@app/shared/forms/form-variables';
import { GenericFieldsForm } from '@app/shared/forms/form-parts/generic-form-part/generic-models';
import { FileUploadComponent } from '@app/shared/forms/components/file-upload/file-upload.component';

@Component({
  selector: 'app-generic-form-part',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe, ScrollbarWidthDirective, FileUploadComponent],
  templateUrl: './generic-form-part.component.html',
  styleUrl: '../../forms.scss',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class GenericFormPartComponent implements OnInit, OnDestroy {
  private readonly parentFormDirective = inject(FormGroupDirective);

  readonly genericFieldsGroup = new FormGroup<GenericFieldsForm>({
    correspondenceDetails: new FormControl<string | null>('', [
      Validators.required,
      Validators.maxLength(maxDescriptionLength),
    ]),
    attachments: new FormControl<File[]>([], { nonNullable: true }),
  });

  ngOnInit() {
    this.parentFormDirective.form.addControl('genericFields', this.genericFieldsGroup);
  }

  ngOnDestroy() {
    this.parentFormDirective.form.removeControl('genericFields');
  }
}
