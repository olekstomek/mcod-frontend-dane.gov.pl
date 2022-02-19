import { Component, EventEmitter, Input, Output } from '@angular/core';
import { StartEndDateRange } from '@app/services/models/startEndDateRange';
import { IAggregationProperties, IAggregationPropertiesForRegions } from '@app/services/models/filters';

/**
 * Custom view Component for all selected filters
 */
@Component({
  selector: 'app-selected-filters',
  templateUrl: './selected-filters.component.html',
})
export class SelectedFiltersComponent {
  /**
   * all selected filters
   */
  @Input() items: { [key: string]: IAggregationProperties; value: any } | StartEndDateRange;

  /**
   * selected filter for regions
   */
  @Input() regions: { [key: string]: IAggregationPropertiesForRegions; value: any } | StartEndDateRange;

  /**
   * if filter is a date
   */
  @Input() isDateType = false;

  /**
   * if filter is a 'star' type
   */
  @Input() isStarsType = false;

  /**
   * if filter is custom (height value data and dynamic data)
   */
  @Input() isCustomFilterName = false;

  /**
   * filter custom name (height value data and dynamic data)
   */
  @Input() customFiltersName: string;

  /**
   * if filter is a region data
   */
  @Input() isRegionsData = false;

  /**
   * event for removing filter
   */
  @Output() removeSelectedFilter = new EventEmitter<string>();

  /**
   * emits key by triggering change on removeSelectedFilter
   * @param {string} key
   */
  onRemoveSelectedFilter(key: string) {
    this.removeSelectedFilter.next(key);
  }
}
