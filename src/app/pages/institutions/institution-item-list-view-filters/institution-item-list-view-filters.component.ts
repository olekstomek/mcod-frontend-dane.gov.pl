import { Component } from '@angular/core';
import { ListViewFilterAbstractComponent } from '@app/shared/filters/list-view-filter-abstract/list-view-filter-abstract.component';
import { InstitutionItemListViewFilterNames } from '@app/services/models/page-filters/institution-item-filters';

/**
 * Institution item filter wrapper for all components
 */
@Component({
    selector: 'app-institution-item-list-view-filters',
    templateUrl: './institution-item-list-view-filters.component.html'
})
export class InstitutionItemListViewFiltersComponent extends ListViewFilterAbstractComponent {

    /**
     * invokes applyFilter from extended component with institution item filter names
     */
    applyFilter() {
        super.applyFilter(InstitutionItemListViewFilterNames);
    }
}
