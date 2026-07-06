import { FormControl } from '@angular/forms';

export interface FeedbackFieldsForm {
  link: FormControl<string>;
  description: FormControl<string>;
}

export interface FeedbackFieldsFormValue {
  link: string;
  description: string;
}
