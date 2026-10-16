import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { GenericFormService } from '@app/services/generic-form.service';
import {
  GenericSubmissionAttributes,
  GenericSubmissionCategory,
  GenericSubmissionResponse,
  GenericSubmissionSubject,
} from '@app/services/models/generic-form';
import {
  CATEGORY_TO_BACKEND_CATEGORY,
  CATEGORY_TO_SUBJECT,
  GenericSubmitData,
  TOPIC_TO_SUBJECT,
} from '@app/shared/forms/form-pages/contact-form/contact-form-models';
import { removeEmptyFields } from '@app/shared/forms/utils/remove-empty-fields';

@Injectable()
export class ContactFormFacade {
  private readonly genericFormService = inject(GenericFormService);

  submitForm(formValue: GenericSubmitData): Observable<GenericSubmissionResponse> {
    const { subject, category } = this.resolveSubjectAndCategory(formValue);
    const attachments = formValue.genericFields?.attachments ?? [];

    const attributes = removeEmptyFields<GenericSubmissionAttributes>({
      subject,
      category,
      content: formValue.genericFields?.correspondenceDetails,
      applicant_full_name: formValue.nameEmail?.name,
      applicant_email: formValue.nameEmail?.email,
    });

    return this.genericFormService.sendGenericSubmission(attributes, attachments);
  }

  private resolveSubjectAndCategory(formValue: GenericSubmitData): {
    subject: GenericSubmissionSubject;
    category?: GenericSubmissionCategory;
  } {
    if (formValue.category) {
      return {
        subject: CATEGORY_TO_SUBJECT[formValue.category] ?? GenericSubmissionSubject.Other,
        category: CATEGORY_TO_BACKEND_CATEGORY[formValue.category],
      };
    }
    return {
      subject: TOPIC_TO_SUBJECT[formValue.topic] ?? GenericSubmissionSubject.Other,
    };
  }
}
