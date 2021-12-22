import { Component, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { toggleVertically } from '@app/animations';
import { ApiConfig } from '@app/services/api';
import { ApiModel } from '@app/services/api/api-model';
import { DatasetService } from '@app/services/dataset.service';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { ListViewDetailsService } from '@app/services/list-view-details.service';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { ListViewSelectedFilterService } from '@app/services/list-view-selected-filter.service';
import { LoginService } from '@app/services/login-service';
import { HttpCustomErrorResponse } from '@app/services/models';
import {
  AggregationFilterNames,
  AggregationOptionType,
  IDatasetListViewFilterAggregationsOptions,
  IListViewFilterAggregationsOptions,
} from '@app/services/models/filters';
import { IListViewDatasetCategoryFiltersModel, IListViewDatasetFiltersModel } from '@app/services/models/page-filters/dataset-filters';
import { NotificationsService } from '@app/services/notifications.service';
import { ObserveService } from '@app/services/observe.service';
import { SearchService } from '@app/services/search.service';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';
import { ListViewFilterPageAbstractComponent } from '@app/shared/filters/list-view-filter-page/list-view-filter-page.abstract.component';
import { SearchAdvancedSettings } from '@app/shared/search-suggest/search-suggest';

/**
 * Dataset Component
 */
@Component({
  selector: 'app-dataset',
  templateUrl: './dataset.component.html',
  animations: [toggleVertically],
})
export class DatasetComponent extends ListViewFilterPageAbstractComponent implements OnInit {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * All date filter fields
   */
  readonly DateFields = [AggregationFilterNames.DATE_FROM, AggregationFilterNames.DATE_TO];

  /**
   * List of filter facets
   * @type {string[]}
   */
  readonly Facets;

  /**
   * sets query form visibility
   */
  isQueryFormVisible = false;

  /**
   * sets if query form is submitted
   */
  isQueryFormSubmitted = false;

  /**
   * sets if query form is subscribed
   */
  isQuerySubscribed = false;

  /**
   * sets if query form has error
   */
  isQueryFormError = false;

  /**
   * Self api of dataset parent component
   */
  selfApi: string;

  /**
   * Default advanced setting
   */
  defaultAdvancedSetting = SearchAdvancedSettings.ANY;

  /**
   * Determines whether user is logged in
   */
  isUserLoggedIn = false;

  constructor(
    protected filterService: ListViewFiltersService,
    protected activatedRoute: ActivatedRoute,
    private router: Router,
    private datasetService: DatasetService,
    private seoService: SeoService,
    private observeService: ObserveService,
    private userService: UserService,
    public loginService: LoginService,
    private notificationsService: NotificationsService,
    protected selectedFiltersService: ListViewSelectedFilterService,
    private listViewDetailsService: ListViewDetailsService,
    private searchService: SearchService,
    protected featureFlagService: FeatureFlagService,
  ) {
    super(filterService, activatedRoute, selectedFiltersService, featureFlagService);
    this.Facets = [
      AggregationOptionType.CATEGORIES,
      AggregationOptionType.INSTITUTION,
      AggregationOptionType.FORMAT,
      AggregationOptionType.OPENNESS_SCORE,
      AggregationOptionType.VISUALIZATION_TYPE,
      AggregationOptionType.TYPES,
      AggregationOptionType.LICENSES,
    ];

    if (this.featureFlagService.validateFlagSync('S29_update_frequency_filter.fe')) {
      this.Facets = [...this.Facets, AggregationOptionType.UPDATE_FREQUENCY];
    }
    if (this.featureFlagService.validateFlagSync('S39_high_value_data_filter.fe')) {
      this.Facets = [...this.Facets, AggregationOptionType.HIGH_VALUE_DATA];
    }
  }

  addSubscriptionToQuery(queryForm: NgForm) {
    if (!queryForm.valid) {
      return;
    }

    this.observeService.addSubscription('query', this.selfApi, queryForm.value.queryInput).subscribe(
      () => {
        this.isQueryFormSubmitted = true;
        this.isQueryFormError = false;
        this.notificationsService.clearAlerts();
      },
      (errorResponse: HttpCustomErrorResponse) => {
        this.isQueryFormSubmitted = false;
        this.notificationsService.clearAlerts();
        this.isQueryFormError = this.datasetService.isQueryError(errorResponse);
      },
    );
  }

  /**
   * Sets META tags (title).
   * Initializes default filters.
   * Initializes and updates list of items (datasets) on query params change.
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Datasets.Self']);

    const newModel = this.getFiltersModel();
    this.selectedFilters = { ...newModel };
    this.backupSelectedFilters = { ...newModel };
    this.isUserLoggedIn = this.userService.isLoggedIn();

    const customParams = [{ key: 'model[terms]', value: 'dataset,resource' }];

    this.activatedRoute.queryParams.subscribe((qParams: Params) => {
      let sort = '';

      if (!this.allBasicParamsIn(qParams)) {
        this.resetSelectedFilters();

        sort = qParams['q'] ? 'relevance' : '-date';
      }

      this.params = { ...qParams, ...this.filterService.updateBasicParams(qParams, this.basicParams, sort) };

      if (!qParams['model[terms]']) {
        this.params['model[terms]'] = 'dataset,resource';
      }

      if (this.filters) {
        this.setSelectedFilters(qParams);
      }

      this.searchService
        .getFilters(ApiConfig.search, this.Facets, customParams)
        .subscribe((allFilters: IDatasetListViewFilterAggregationsOptions | IListViewFilterAggregationsOptions) => {
          this.filters = allFilters;
          this.setSelectedFilters(this.params);
          this.getData();
        });
    });
  }

  /**
   * Move to search results list for screen reader
   */
  moveToSearchResult() {
    document.getElementById('search-counters-label').focus();
  }

  /**
   * Back to search input for screen reader
   */
  backToSearchControl() {
    const elem = <HTMLElement>document.getElementsByClassName('search-suggest__input')[0];
    elem.focus();
  }

  /**
   * Gets list of datasets
   */
  protected getData() {
    this.searchService.getData(ApiConfig.search, this.params).subscribe(response => {
      let results = response.results ? response.results : [];
      this.counters = response.aggregations.counters;
      if (this.filters) {
        results = this.addInsitutions(results);
      }

      this.items = this.listViewDetailsService.extendViewDetails(results);
      this.count = response.count;
      this.selfApi = response.links.self;

      this.isQueryFormVisible = this.count && ((this.params && this.params.q && this.params.q.length) || this.selectedFiltersCount);
      this.isQueryFormSubmitted = false;
      this.isQueryFormError = false;
      this.isQuerySubscribed = !!response.subscription_url;
    });
  }

  /**
   * returns new empty data model for filters
   * @return {IListViewDatasetFiltersModel}
   */
  protected getFiltersModel(): IListViewDatasetFiltersModel | IListViewDatasetCategoryFiltersModel {
    // @ts-ignore
    return {
      [AggregationFilterNames.CATEGORIES]: {},
      [AggregationFilterNames.INSTITUTION]: {},
      [AggregationFilterNames.FORMAT]: {},
      [AggregationFilterNames.OPENNESS_SCORE]: {},
      [AggregationFilterNames.VISUALIZATION_TYPE]: {},
      [AggregationFilterNames.TYPES]: {},
      [AggregationFilterNames.LICENSES]: {},
      [AggregationFilterNames.UPDATE_FREQUENCY]: {},
      [AggregationFilterNames.HIGH_VALUE_DATA]: {},
      [AggregationFilterNames.DATE_FROM]: null,
      [AggregationFilterNames.DATE_TO]: null,
    };
  }

  /**
   * returns count of selected filters
   * @return {number}
   */
  protected getSelectedFiltersCount(): number {
    return (
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.CATEGORIES]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.INSTITUTION]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.FORMAT]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.OPENNESS_SCORE]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.VISUALIZATION_TYPE]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.TYPES]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.LICENSES]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.UPDATE_FREQUENCY]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.HIGH_VALUE_DATA]) +
      (this.backupSelectedFilters[AggregationFilterNames.DATE_FROM] || this.backupSelectedFilters[AggregationFilterNames.DATE_TO] ? 1 : 0)
    );
  }

  /**
   * adds institution when relationships is available in the model
   * @param {any[]} results
   * @returns {any[]}
   */
  private addInsitutions(results: any[]): any[] {
    let institutionData;
    let institutionLinkRelated;
    let lastCommaIndex;

    return results.map(dataset => {
      if (dataset.relationships) {
        institutionData = dataset.relationships.institution;
        dataset.institution = this.filters[AggregationOptionType.INSTITUTION].find(institution => {
          return institutionData.data.type === this.apiModel.INSTITUTION && institutionData.data.id === institution.id;
        });

        if (dataset.institution) {
          institutionLinkRelated = institutionData.links.related;
          lastCommaIndex = institutionLinkRelated.lastIndexOf(',');
          dataset.institution.slug = institutionLinkRelated.slice(lastCommaIndex + 1, institutionLinkRelated.length);
        }
      }

      return dataset;
    });
  }
}
