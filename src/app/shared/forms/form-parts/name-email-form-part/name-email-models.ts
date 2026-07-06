import { FormControl } from '@angular/forms';

export interface NameEmailForm {
  name: FormControl<string | null>;
  email: FormControl<string | null>;
}

export interface NameEmailFormValue {
  name: string | null;
  email: string | null;
}
