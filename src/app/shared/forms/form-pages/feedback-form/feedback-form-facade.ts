import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatasetService } from '@app/services/dataset.service';
import { FeedbackSubmitData, FeedbackPayload } from '@app/shared/forms/form-pages/feedback-form/feedback-form-models';
import { removeEmptyFields } from '@app/shared/forms/utils/remove-empty-fields';

@Injectable()
export class FeedbackFormFacade {
  private readonly datasetService = inject(DatasetService);

  submitForm(formValue: FeedbackSubmitData): Observable<unknown> {
    const link = formValue.feedbackFields?.link;
    const payload = this.buildPayload(formValue);
    const resourceMatch = link.match(/\/resource\/(\d+)/);

    if (resourceMatch) {
      const resourceId = resourceMatch[1];
      return this.datasetService.sendResourceFeedback(resourceId, payload);
    } else {
      const datasetMatch = link.match(/\/dataset\/(\d+)/);
      const datasetId = datasetMatch[1];
      return this.datasetService.sendDatasetFeedback(datasetId, payload);
    }
  }

  private buildPayload(formValue: FeedbackSubmitData): FeedbackPayload {
    return removeEmptyFields({
      comment: formValue.feedbackFields?.description,
      applicant_email: formValue.nameEmail?.email,
      applicant_full_name: formValue.nameEmail?.name,
    });
  }
}
