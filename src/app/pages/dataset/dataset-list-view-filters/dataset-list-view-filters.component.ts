import { Component } from '@angular/core';

import { DatasetListViewFilterNames } from '@app/services/models/page-filters/dataset-filters';
import { ListViewFilterAbstractComponent } from '@app/shared/filters/list-view-filter-abstract/list-view-filter-abstract.component';

/**
 * Dataset filter wrapper for all components
 */
@Component({
    selector: 'app-dataset-list-view-filters',
    templateUrl: './dataset-list-view-filters.component.html'
})
export class DatasetListViewFiltersComponent extends ListViewFilterAbstractComponent {

    /**
     * invokes applyFilter from extended component with dataset filter names
     */
    applyFilter() {
        super.applyFilter(DatasetListViewFilterNames);
    }
}
