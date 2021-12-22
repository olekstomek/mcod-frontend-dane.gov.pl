import { Component, Input } from '@angular/core';
import { ListViewFilterAbstractComponent } from '@app/shared/filters/list-view-filter-abstract/list-view-filter-abstract.component';
import { InstitutionListViewFilterNames } from '@app/services/models/page-filters/institution-filters';

/**
 * Institution filter wrapper for all components
 */
@Component({
  selector: 'app-institution-list-view-filters',
  templateUrl: './institution-list-view-filters.component.html',
})
export class InstitutionListViewFiltersComponent extends ListViewFilterAbstractComponent {
  /**
   * set filter name for automatic test
   */
  @Input() filterName: string;

  /**
   * invokes applyFilter from extended component with institution filter names
   */
  applyFilter() {
    super.applyFilter(InstitutionListViewFilterNames);
  }
}
