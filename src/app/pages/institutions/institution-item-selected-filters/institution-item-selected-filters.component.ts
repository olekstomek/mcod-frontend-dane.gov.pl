import { Component } from '@angular/core';
import { toggle } from '@app/animations';
import { ListViewSelectedFiltersAbstractComponent } from '@app/shared/filters/list-view-selected-filters-abstract/list-view-selected-filters.abstract.component';

/**
 * Institution item selected filter wrapper for all selected filters
 */
@Component({
  selector: 'app-institution-item-selected-filters',
  templateUrl: './institution-item-selected-filters.component.html',
  animations: [toggle],
})
export class InstitutionItemSelectedFiltersComponent extends ListViewSelectedFiltersAbstractComponent {}
