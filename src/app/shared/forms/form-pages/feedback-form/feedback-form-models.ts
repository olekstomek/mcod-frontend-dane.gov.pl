import { FormGroup, FormControl } from '@angular/forms';
import { NameEmailForm, NameEmailFormValue } from '@app/shared/forms/form-parts/name-email-form-part/name-email-models';
import {
  FeedbackFieldsForm,
  FeedbackFieldsFormValue,
} from '@app/shared/forms/form-parts/feedback-fields-form-part/feedback-fields-models';

export interface FeedbackForm {
  nameEmail?: FormGroup<NameEmailForm>;
  feedbackFields?: FormGroup<FeedbackFieldsForm>;
  captcha: FormControl<string | null>;
}

export interface FeedbackSubmitData {
  nameEmail?: NameEmailFormValue;
  feedbackFields?: FeedbackFieldsFormValue;
}

export interface FeedbackPayload {
  comment: string;
  applicant_email?: string;
  applicant_full_name?: string;
}
