import { AsyncPipe } from '@angular/common';
import { Component, inject, OnInit, ChangeDetectionStrategy } from '@angular/core';
import {
  ControlContainer,
  FormArray,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { CmsHardcodedPages } from '@app/services/api/api.cms.config';
import { CmsService } from '@app/services/cms.service';
import {
  imageDimensionsValidator,
  maxFileSizeValidator,
  maxItemLengthCommaSeparatedValidator,
  requiredOneValueValidator,
} from '@app/shared/forms/form-validators';
import {
  keywordsSingleItemLength,
  maxDescriptionLength,
  maxFileSize,
  standardInputLength,
  linkInputLength,
  linkPattern,
  logoMaxWidth,
  logoMaxHeight,
  illustrativeGraphicsMaxWidth,
  illustrativeGraphicsMaxHeight,
} from '@app/shared/forms/form-variables';
import { MathCaptchaComponent } from '@app/shared/math-captcha/math-captcha.component';
import { TextToLinksPipe } from '@app/shared/pipes/text-to-links.pipe';
import { TranslatePipe } from '@ngx-translate/core';
import { ScrollbarWidthDirective } from '@app/shared/forms/directives/scrollbar-width.directive';
import { ImageUploadComponent } from '@app/shared/forms/components/image-upload/image-upload.component';
import { DatasetAutocompleteDirective } from '@app/shared/forms/directives/dataset-autocomplete.directive';
import { map } from 'rxjs/operators';
import {
  DatasetForm,
  PoCoToCategory,
  PoCoToFieldsForm,
  PoCoToLicenseType,
} from '@app/shared/forms/form-parts/po-co-to-fields-form-part/po-co-to-fields-models';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

interface IComponentOptions<T> {
  label: string;
  value: T;
}

@Component({
  selector: 'app-po-co-to-fields-form-part',
  standalone: true,
  imports: [
    ReactiveFormsModule,
    TranslatePipe,
    DatasetAutocompleteDirective,
    TextToLinksPipe,
    MathCaptchaComponent,
    ScrollbarWidthDirective,
    ImageUploadComponent,
    DatasetAutocompleteDirective,
    AsyncPipe,
  ],
  templateUrl: './po-co-to-fields-form-part.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  styleUrl: '../../forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class PoCoToFieldsFormPartComponent implements OnInit {
  private parentFormDirective = inject(FormGroupDirective);
  private readonly cmsService = inject(CmsService);

  protected readonly PoCoToCategory = PoCoToCategory;
  protected readonly logoMaxWidth = logoMaxWidth;
  protected readonly logoMaxHeight = logoMaxHeight;
  protected readonly illustrativeGraphicsMaxWidth = illustrativeGraphicsMaxWidth;
  protected readonly illustrativeGraphicsMaxHeight = illustrativeGraphicsMaxHeight;

  cmsPageInfo$ = this.cmsService
    .getSimplePage(CmsHardcodedPages.APPLICATION_DATA_PROCESSING_INFO)
    .pipe(map((content) => content.body));
  cmsPageConsent$ = this.cmsService
    .getSimplePage(CmsHardcodedPages.APPLICATION_DATA_PROCESSING_CONSENT)
    .pipe(map((content) => content.body));

  categoryOptions: IComponentOptions<PoCoToCategory>[] = [
    { label: 'Forms.PoCoToSection.CategorySelect.Option1', value: PoCoToCategory.App },
    { label: 'Forms.PoCoToSection.CategorySelect.Option2', value: PoCoToCategory.Www },
    { label: 'Forms.PoCoToSection.CategorySelect.Option3', value: PoCoToCategory.Other },
  ];

  licenseTypeOptions: IComponentOptions<PoCoToLicenseType>[] = [
    { label: 'Forms.PoCoToSection.LicenseTypeRadio.Option1', value: PoCoToLicenseType.Free },
    { label: 'Forms.PoCoToSection.LicenseTypeRadio.Option2', value: PoCoToLicenseType.Commercial },
  ];

  poCoToFieldsGroup = new FormGroup<PoCoToFieldsForm>({
    category: new FormControl(null, Validators.required),
    name: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(standardInputLength)],
    }),
    url: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.pattern(linkPattern), Validators.maxLength(linkInputLength)],
    }),
    mobileAppGroup: new FormGroup(
      {
        isMobileApp: new FormControl(false, { nonNullable: true }),
        androidLink: new FormControl('', {
          nonNullable: true,
          validators: [Validators.pattern(linkPattern), Validators.maxLength(linkInputLength)],
        }),
        appleLink: new FormControl('', {
          nonNullable: true,
          validators: [Validators.pattern(linkPattern), Validators.maxLength(linkInputLength)],
        }),
      },
      requiredOneValueValidator('isMobileApp', ['androidLink', 'appleLink']),
    ),
    desktopAppGroup: new FormGroup(
      {
        isDesktopApp: new FormControl(false, { nonNullable: true }),
        linuxLink: new FormControl('', {
          nonNullable: true,
          validators: [Validators.pattern(linkPattern), Validators.maxLength(linkInputLength)],
        }),
        macLink: new FormControl('', {
          nonNullable: true,
          validators: [Validators.pattern(linkPattern), Validators.maxLength(linkInputLength)],
        }),
        windowsLink: new FormControl('', {
          nonNullable: true,
          validators: [Validators.pattern(linkPattern), Validators.maxLength(linkInputLength)],
        }),
      },
      requiredOneValueValidator('isDesktopApp', ['linuxLink', 'macLink', 'windowsLink']),
    ),
    licenseType: new FormControl(null),
    description: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(maxDescriptionLength)],
    }),
    keywords: new FormControl('', {
      nonNullable: true,
      validators: [maxItemLengthCommaSeparatedValidator(keywordsSingleItemLength)],
    }),
    author: new FormControl('', {
      nonNullable: true,
      validators: [Validators.required, Validators.maxLength(standardInputLength)],
    }),
    logoImage: new FormControl(null, {
      validators: [maxFileSizeValidator(maxFileSize)],
      asyncValidators: [imageDimensionsValidator(logoMaxWidth, logoMaxHeight)],
    }),
    illustrativeGraphics: new FormControl(null, {
      validators: [maxFileSizeValidator(maxFileSize)],
      asyncValidators: [imageDimensionsValidator(illustrativeGraphicsMaxWidth, illustrativeGraphicsMaxHeight)],
    }),
    datasets: new FormArray([]),
    externalDatasets: new FormArray([]),
    tosAccepted: new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue }),
    personalDataAccepted: new FormControl(false, { nonNullable: true, validators: Validators.requiredTrue }),
    captcha: new FormControl(null, Validators.required),
  });

  constructor() {
    this.poCoToFieldsGroup.controls.category.valueChanges.pipe(takeUntilDestroyed()).subscribe((category) => {
      if ([PoCoToCategory.App, PoCoToCategory.Www].includes(category)) {
        this.poCoToFieldsGroup.controls.licenseType.setValidators(Validators.required);
      } else {
        this.poCoToFieldsGroup.controls.licenseType.clearValidators();
      }
      this.poCoToFieldsGroup.controls.licenseType.updateValueAndValidity();
    });
  }

  ngOnInit() {
    this.parentFormDirective.form.addControl('poCoToFields', this.poCoToFieldsGroup);
  }

  onDatasetSelected(dataset: { id: string; title: string } | null, datasetControl: FormGroup<DatasetForm>) {
    datasetControl.setValue({ dataset: dataset?.title ?? datasetControl.value.dataset, id: dataset?.id ?? null });
  }

  onAppendDatasetRow() {
    this.poCoToFieldsGroup.controls.datasets.push(
      new FormGroup({
        dataset: new FormControl(null),
        id: new FormControl(null, Validators.required),
      }),
    );
  }

  onRemoveDatasetRow(index: number) {
    this.poCoToFieldsGroup.controls.datasets.removeAt(index);
  }

  onAppendExternalDatasetRow() {
    this.poCoToFieldsGroup.controls.externalDatasets.push(
      new FormGroup({
        title: new FormControl(null, [Validators.required, Validators.maxLength(standardInputLength)]),
        url: new FormControl(null, [
          Validators.required,
          Validators.pattern(linkPattern),
          Validators.maxLength(linkInputLength),
        ]),
      }),
    );
  }

  onRemoveExternalDatasetRow(index: number) {
    this.poCoToFieldsGroup.controls.externalDatasets.removeAt(index);
  }
}
