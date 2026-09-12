import { FormControl, FormGroup } from '@angular/forms';
import { NameEmailForm, NameEmailFormValue } from '@app/shared/forms/form-parts/name-email-form-part/name-email-models';
import {
  SuggestDatasetFieldsForm,
  SuggestDatasetFieldsFormValue,
} from '@app/shared/forms/form-parts/suggest-dataset-form-part/suggest-dataset-form-part-models';

export interface SuggestDatasetForm {
  nameEmail?: FormGroup<NameEmailForm>;
  suggestDatasetFields?: FormGroup<SuggestDatasetFieldsForm>;
  captcha: FormControl<string | null>;
}

export interface SuggestDatasetSubmitData {
  nameEmail?: NameEmailFormValue;
  suggestDatasetFields?: SuggestDatasetFieldsFormValue;
}

export interface SuggestDatasetPayload {
  applicant_email?: string;
  applicant_full_name?: string;
  data_link?: string;
  notes: string;
  organization_name?: string;
  potential_possibilities?: string;
  title: string;
}
