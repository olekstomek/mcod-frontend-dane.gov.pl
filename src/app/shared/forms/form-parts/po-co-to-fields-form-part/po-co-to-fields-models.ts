import { FormControl, FormGroup, FormArray } from '@angular/forms';

export enum PoCoToCategory {
  App = 'app',
  Www = 'www',
  Other = 'other',
}

export enum PoCoToLicenseType {
  Free = 'free',
  Commercial = 'commercial',
}

export interface PoCoToFieldsForm {
  category: FormControl<PoCoToCategory | null>;
  name: FormControl<string>;
  url: FormControl<string>;
  mobileAppGroup: FormGroup<MobileAppForm>;
  desktopAppGroup: FormGroup<DesktopAppForm>;
  licenseType: FormControl<PoCoToLicenseType | null>;
  description: FormControl<string>;
  keywords: FormControl<string>;
  author: FormControl<string>;
  logoImage: FormControl<File | null>;
  illustrativeGraphics: FormControl<File | null>;
  datasets: FormArray<FormGroup<DatasetForm>>;
  externalDatasets: FormArray<FormGroup<ExternalDatasetForm | null>>;
  tosAccepted: FormControl<boolean>;
  personalDataAccepted: FormControl<boolean>;
  captcha: FormControl<string | null>;
}

export interface PoCoToFieldsFormValue {
  category: PoCoToCategory | null;
  name: string;
  url: string;
  mobileAppGroup: MobileAppFormValue;
  desktopAppGroup: DesktopAppFormValue;
  licenseType: PoCoToLicenseType | null;
  description: string;
  keywords: string | string[];
  author: string;
  logoImage: File | null;
  illustrativeGraphics: File | null;
  datasets: DatasetFormValue[];
  externalDatasets: ExternalDatasetFormValue[];
  tosAccepted: boolean;
  personalDataAccepted: boolean;
  captcha: string | null;
}

export interface MobileAppForm {
  isMobileApp: FormControl<boolean>;
  androidLink: FormControl<string>;
  appleLink: FormControl<string>;
}

export interface MobileAppFormValue {
  isMobileApp: boolean;
  androidLink: string;
  appleLink: string;
}

export interface DesktopAppForm {
  isDesktopApp: FormControl<boolean>;
  linuxLink: FormControl<string>;
  macLink: FormControl<string>;
  windowsLink: FormControl<string>;
}

export interface DesktopAppFormValue {
  isDesktopApp: boolean;
  linuxLink: string;
  macLink: string;
  windowsLink: string;
}

export interface DatasetForm {
  dataset: FormControl<string | null>;
  id: FormControl<string | null>;
}

export interface DatasetFormValue {
  dataset: string | null;
  id: string | null;
}

export interface ExternalDatasetForm {
  title: FormControl<string | null>;
  url: FormControl<string | null>;
}

export interface ExternalDatasetFormValue {
  title: string | null;
  url: string | null;
}
