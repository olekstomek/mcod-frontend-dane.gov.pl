import { FormControl } from '@angular/forms';

export interface GenericFieldsForm {
  correspondenceDetails: FormControl<string | null>;
  attachments: FormControl<File[]>;
}

export interface GenericFieldsFormValue {
  correspondenceDetails: string | null;
  attachments: File[];
}
