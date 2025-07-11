import { Component, EventEmitter, Input, Output } from '@angular/core';

import { DatasetListViewFilterNames } from '@app/services/models/page-filters/dataset-filters';
import { ListViewFilterAbstractComponent } from '@app/shared/filters/list-view-filter-abstract/list-view-filter-abstract.component';

/**
 * Dataset filter wrapper for all components
 */
@Component({
  selector: 'app-dataset-list-view-filters',
  templateUrl: './dataset-list-view-filters.component.html',
})
export class DatasetListViewFiltersComponent extends ListViewFilterAbstractComponent {
  @Input() showHideMapButton = false;
  @Input() initialValue: string;
  @Output() showMapEmit = new EventEmitter<boolean>();
  /**
   * invokes applyFilter from extended component with dataset filter names
   */
  applyFilter() {
    super.applyFilter(DatasetListViewFilterNames);
  }
}
