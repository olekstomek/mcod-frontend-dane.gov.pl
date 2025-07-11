import { Component, Input } from '@angular/core';

/**
 * Search result component
 */
@Component({
  selector: 'app-search-results-view',
  templateUrl: './search-results-view.component.html',
})
export class SearchResultsViewComponent {
  /**
   * data to display
   */
  @Input() items: any[];
}
