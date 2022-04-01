import { ActivatedRoute, Params, Router, QueryParamsHandling } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ApplicationsService } from '@app/services/applications.service';
import { ListViewSelectedFilterService } from '@app/services/list-view-selected-filter.service';
import { AggregationFilterNames, AggregationOptionType, IListViewFilterAggregationsOptions } from '@app/services/models/filters';
import { IListViewApplicationsFiltersModel } from '@app/services/models/page-filters/applications-filters';
import { IListViewDatasetFiltersModel } from '@app/services/models/page-filters/dataset-filters';
import { SeoService } from '@app/services/seo.service';
import { SearchService } from '@app/services/search.service';
import { ApiConfig } from '@app/services/api';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { BasicPageParams } from '@app/services/models/page-params';
import { ApiModel } from '@app/services/api/api-model';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { ListViewFilterPageAbstractComponent } from '@app/shared/filters/list-view-filter-page/list-view-filter-page.abstract.component';

/**
 * Application Component
 */
@Component({
  selector: 'app-application',
  templateUrl: './application.component.html',
})
export class ApplicationComponent extends ListViewFilterPageAbstractComponent implements OnInit {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * List of filter facets
   * @type {string[]}
   */
  readonly Facets;

  /**
   * Array of items (applications)
   */
  items: any[];

  /**
   * Count of items (applications)
   */
  count: number;

  /**
   * Number of pagination pages
   */
  numPages = 0;

  /**
   * Page setting based on basic params and user interactions
   */
  params: Params;

  /**
   * Basic params of application component
   */
  basicParams: BasicPageParams = {
    sort: '-date',
    page: 1,
    q: '',
    per_page: 5,
  };

  constructor(
    protected filterService: ListViewFiltersService,
    protected selectedFiltersService: ListViewSelectedFilterService,
    protected activatedRoute: ActivatedRoute,
    private seoService: SeoService,
    private router: Router,
    private applicationsService: ApplicationsService,
    private searchService: SearchService,
    protected featureFlagService: FeatureFlagService,
  ) {
    super(filterService, activatedRoute, selectedFiltersService, featureFlagService);

    this.Facets = [AggregationOptionType.SHOWCASE_CATEGORY, AggregationOptionType.SHOWCASE_TYPE, AggregationOptionType.SHOWCASE_PLATFORMS];
  }

  /**
   * Sets META tags (title).
   * Initializes and updates list of items (applications) on query params change.
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Menu.Showcases']);

    const newModel = this.getFiltersModel();
    this.selectedFilters = { ...newModel };
    this.backupSelectedFilters = { ...newModel };

    this.activatedRoute.queryParams.subscribe((qParams: Params) => {
      let sort = '';

      if (!this.allBasicParamsIn(qParams)) {
        sort = qParams['q'] ? 'relevance' : this.basicParams['sort'];
      }

      this.params = { ...qParams, ...this.filterService.updateBasicParams(qParams, this.basicParams, sort) };

      if (!qParams['model[terms]']) {
        this.params['model[terms]'] = ApiModel.SHOWCASE;
      }

      const customParams = [{ key: 'model[terms]', value: ApiModel.SHOWCASE }];
      if (this.filters) {
        this.setSelectedFilters(qParams);
      }

      this.searchService
        .getFilters(ApiConfig.search, this.Facets, customParams)
        .subscribe((allFilters: IListViewFilterAggregationsOptions) => {
          this.filters = allFilters;
          this.setSelectedFilters(this.params);
          this.getData();
        });
    });
  }

  /**
   * Gets list of applications
   */
  protected getData() {
    this.searchService.getData(ApiConfig.search, this.params).subscribe(response => {
      this.items = response.results;
      this.count = response.count;
    });
  }

  /**
   * returns new empty data model for filters
   * @return {IListViewDatasetFiltersModel}
   */
  protected getFiltersModel(): IListViewApplicationsFiltersModel {
    return {
      [AggregationFilterNames.SHOWCASE_CATEGORY]: {},
      [AggregationFilterNames.SHOWCASE_TYPE]: {},
      [AggregationFilterNames.SHOWCASE_PLATFORMS]: {},
    };
  }

  /**
   * returns count of selected filters
   * @return {number}
   */
  protected getSelectedFiltersCount(): number {
    return (
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.SHOWCASE_CATEGORY]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.SHOWCASE_TYPE]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.SHOWCASE_PLATFORMS])
    );
  }

  /**
   * Move to search results list for screen reader
   */
  moveToSearchResult() {
    document.getElementById('search-counters-label').focus();
  }
}
