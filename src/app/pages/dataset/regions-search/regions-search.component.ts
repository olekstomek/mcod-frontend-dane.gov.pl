import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { ActivatedRoute, Params } from '@angular/router';
import { ApiModel } from '@app/services/api/api-model';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { ListViewSelectedFilterService } from '@app/services/list-view-selected-filter.service';
import { IAggregationPropertiesForRegions } from '@app/services/models/filters';
import { ListViewFilterPageAbstractComponent } from '@app/shared/filters/list-view-filter-page/list-view-filter-page.abstract.component';
import { SearchSuggestRegionListboxOption } from '@app/shared/search-suggest/search-suggest';

@Component({
  selector: 'app-regions-search',
  templateUrl: './regions-search.component.html',
})
export class RegionsSearchComponent extends ListViewFilterPageAbstractComponent implements OnInit {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * Link to API
   */
  selfApi: string;

  qPar: Params;

  regionId: number;

  noResults: boolean;

  /**
   * placeholder for search input
   */
  @Input() placeholderTranslationKey = 'Action.EnterRegion';

  @Output() enableApply = new EventEmitter<boolean>();

  @Output() selectedChange = new EventEmitter<IAggregationPropertiesForRegions>();

  constructor(
    protected filterService: ListViewFiltersService,
    protected activatedRoute: ActivatedRoute,
    protected selectedFiltersService: ListViewSelectedFilterService,
    protected featureFlagService: FeatureFlagService,
  ) {
    super(filterService, activatedRoute, selectedFiltersService, featureFlagService);
  }

  ngOnInit(): void {
    this.activatedRoute.queryParams.subscribe((qParams: Params) => {
      const sort = 'relevance';
      this.qPar = qParams;

      if (!this.allBasicParamsIn(qParams)) {
        this.resetSelectedFilters();
      }

      this.params = { ...qParams, ...this.filterService.updateBasicParams(qParams, this.basicParams, sort) };
    });
  }

  getAllFilters(listboxOption: SearchSuggestRegionListboxOption) {
    if (listboxOption) {
      this.noResults = false;
      this.regionId = listboxOption.region_id;
      this.enableApply.emit(true);
      this.selectedChange.next(listboxOption);
    } else {
      this.noResults = true;
    }
  }

  protected getData() {}

  protected getFiltersModel() {}

  protected getSelectedFiltersCount() {}
}
