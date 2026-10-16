import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

import { ApiConfig } from '@app/services/api';
import { GenericSubmissionAttributes, GenericSubmissionResponse } from '@app/services/models/generic-form';
import { RestService } from '@app/services/rest.service';

/**
 * Service that handles communication with generic contact submission API `/submissions/generic`
 */
@Injectable({
  providedIn: 'root',
})
export class GenericFormService extends RestService {
  /**
   * Sends generic contact submission (with or without attachments)
   * @param {GenericSubmissionAttributes} attributes
   * @param {File[]} attachments
   * @returns {Observable<GenericSubmissionResponse>}
   */
  sendGenericSubmission(
    attributes: GenericSubmissionAttributes,
    attachments?: File[],
  ): Observable<GenericSubmissionResponse> {
    const jsonData = {
      data: {
        type: 'generic-contact-submission',
        attributes,
      },
    };

    if (attachments?.length > 0) {
      const formData = new FormData();
      formData.append('data', JSON.stringify(jsonData));
      attachments.forEach((file) => formData.append('attachments', file, file.name));
      return this.post(ApiConfig.submissionsGeneric, formData);
    }

    return this.post(ApiConfig.submissionsGeneric, jsonData);
  }
}
