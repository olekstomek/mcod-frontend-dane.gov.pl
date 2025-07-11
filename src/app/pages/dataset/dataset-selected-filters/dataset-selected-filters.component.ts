import { Component } from '@angular/core';
import { toggle } from '@app/animations';
import { ListViewSelectedFiltersAbstractComponent } from '@app/shared/filters/list-view-selected-filters-abstract/list-view-selected-filters.abstract.component';

/**
 * Dataset selected filter wrapper for all selected filters
 */
@Component({
  selector: 'app-dataset-selected-filters',
  templateUrl: './dataset-selected-filters.component.html',
  animations: [toggle],
})
export class DatasetSelectedFiltersComponent extends ListViewSelectedFiltersAbstractComponent {}
