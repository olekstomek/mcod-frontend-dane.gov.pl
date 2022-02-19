import { Component, Input } from '@angular/core';
import { ApiModel } from '@app/services/api/api-model';

/**
 * Component to show dataset results
 */
@Component({
  selector: 'app-dataset-results',
  templateUrl: './dataset-results.component.html',
})
export class DatasetResultsComponent {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * items to display
   */
  @Input() items: any;

  /**
   * is user logged in
   */
  @Input() isUserLoggedIn = false;
}
