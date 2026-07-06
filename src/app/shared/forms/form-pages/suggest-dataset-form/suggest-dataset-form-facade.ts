import { inject, Injectable } from '@angular/core';
import { DatasetService } from '@app/services/dataset.service';
import {
  SuggestDatasetFormValue,
  SuggestDatasetPayload,
} from '@app/shared/forms/form-pages/suggest-dataset-form/suggest-dataset-form-model';
import { Observable } from 'rxjs';
import { ApiResponse } from '@app/services/api';
import { removeEmptyFields } from '@app/shared/forms/utils/remove-empty-fields';

@Injectable()
export class SuggestDatasetFormFacade {
  private readonly datasetService = inject(DatasetService);

  submitForm(formValue: SuggestDatasetFormValue): Observable<ApiResponse> {
    return this.datasetService.sendSubmission(this.buildPayload(formValue));
  }

  private buildPayload(formValue: SuggestDatasetFormValue): SuggestDatasetPayload {
    if (formValue.suggestDatasetFields?.foundLink) {
      formValue.suggestDatasetFields.foundLink = this.addHttpIfMissing(formValue.suggestDatasetFields.foundLink);
    }

    return removeEmptyFields({
      applicant_email: formValue.nameEmail?.email,
      applicant_full_name: formValue.nameEmail?.name,
      data_link: formValue.suggestDatasetFields?.foundLink,
      notes: formValue.suggestDatasetFields?.description,
      organization_name: formValue.suggestDatasetFields?.institution,
      potential_possibilities: formValue.suggestDatasetFields?.potentialUses,
      title: formValue.suggestDatasetFields?.nameOfData,
    });
  }

  private addHttpIfMissing(url: string): string {
    if (url.split('http://').length > 1 || url.split('https://').length > 1) {
      return url;
    } else {
      return 'http://' + url;
    }
  }
}
