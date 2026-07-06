import { FormGroup } from '@angular/forms';
import {
  PoCoToFieldsForm,
  PoCoToFieldsFormValue,
  PoCoToCategory,
  PoCoToLicenseType,
} from '@app/shared/forms/form-parts/po-co-to-fields-form-part/po-co-to-fields-models';
import { NameEmailForm, NameEmailFormValue } from '@app/shared/forms/form-parts/name-email-form-part/name-email-models';

export interface PoCoToForm {
  nameEmail?: FormGroup<NameEmailForm>;
  poCoToFields?: FormGroup<PoCoToFieldsForm>;
}

export interface PoCoToFormValue {
  nameEmail?: NameEmailFormValue;
  poCoToFields?: PoCoToFieldsFormValue;
}

export interface PocoToFormPayload {
  applicant_email: string;
  applicant_full_name: string;
  author: string;
  category: PoCoToCategory;
  datasets?: string[];
  desktop_linux_url?: string;
  desktop_macos_url?: string;
  desktop_windows_url?: string;
  external_datasets?: { title: string; url: string }[];
  illustrative_graphics?: string;
  image?: string;
  is_desktop_app?: boolean;
  is_mobile_app?: boolean;
  is_personal_data_processing_accepted: boolean;
  is_terms_of_service_accepted: boolean;
  keywords?: string[];
  license_type?: PoCoToLicenseType;
  mobile_apple_url?: string;
  mobile_google_url?: string;
  notes: string;
  title: string;
  url: string;
}
