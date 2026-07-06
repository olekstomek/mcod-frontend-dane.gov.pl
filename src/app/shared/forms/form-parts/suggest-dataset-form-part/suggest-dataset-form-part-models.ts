import { FormControl } from '@angular/forms';

export interface SuggestDatasetFieldsForm {
  nameOfData: FormControl<string>;
  description: FormControl<string>;
  institution: FormControl<string>;
  foundLink: FormControl<string>;
  potentialUses: FormControl<string>;
}

export interface SuggestDatasetFieldsFormValue {
  nameOfData: string;
  description: string;
  institution: string;
  foundLink: string;
  potentialUses: string;
}
