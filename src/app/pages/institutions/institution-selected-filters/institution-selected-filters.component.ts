import { Component } from '@angular/core';
import { toggle } from '@app/animations';
import { ListViewSelectedFiltersAbstractComponent } from '@app/shared/filters/list-view-selected-filters-abstract/list-view-selected-filters.abstract.component';

/**
 * Institution selected filter wrapper for all selected filters
 */
@Component({
    selector: 'app-institution-selected-filters',
    templateUrl: './institution-selected-filters.component.html',
    animations: [toggle]
})
export class InstitutionSelectedFiltersComponent extends ListViewSelectedFiltersAbstractComponent {
}
