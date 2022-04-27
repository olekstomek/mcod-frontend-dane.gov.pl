import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { IAggregationArray } from '@app/services/models/map';
import { IListViewDatasetCategoryFiltersModel, IListViewDatasetFiltersModel } from '@app/services/models/page-filters/dataset-filters';
import { NotificationsService } from '@app/services/notifications.service';
import { ObserveService } from '@app/services/observe.service';
import { SearchService } from '@app/services/search.service';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';
import { ListViewFilterPageAbstractComponent } from '@app/shared/filters/list-view-filter-page/list-view-filter-page.abstract.component';
import { SearchAdvancedSettings } from '@app/shared/search-suggest/search-suggest';
import { BehaviorSubject } from 'rxjs';

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

  /**
   * show map button
   */
  showMap: boolean;

  /**
   * set default location to Poland when open map without choice location in filter
   */
  isDefaultLocation: boolean;

  sortOption: string;

  /**
   * map aggregation array
   */
  mapAggregations: IAggregationArray;

  /**
   * refresh map after user chose a new location
   */
  refreshMap = new BehaviorSubject<any>(null);

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
    private cdrf: ChangeDetectorRef,
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
      AggregationOptionType.HIGH_VALUE_DATA,
      AggregationOptionType.DYNAMIC_DATA,
    ];

    if (this.featureFlagService.validateFlagSync('S29_update_frequency_filter.fe')) {
      this.Facets = [...this.Facets, AggregationOptionType.UPDATE_FREQUENCY];
    }

    if (this.featureFlagService.validateFlagSync('S47_research_data_filter.fe')) {
      this.Facets = [...this.Facets, AggregationOptionType.RESEARCH_DATA];
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

    let customParams = [{ key: 'model[terms]', value: 'dataset,resource' }];

    this.activatedRoute.queryParams.subscribe((qParams: Params) => {
      let sort = '';

      if (!this.allBasicParamsIn(qParams)) {
        this.resetSelectedFilters();

        sort = qParams['q'] ? 'relevance' : '-date';
      }

      this.params = {
        ...qParams,
        ...this.filterService.updateBasicParams(qParams, this.basicParams, sort),
      };

      if (!qParams['model[terms]']) {
        this.params['model[terms]'] = 'dataset,resource';
      }

      if (this.filters) {
        this.setSelectedFilters(qParams);
      }

      if (
        qParams['regions[id][terms]'] &&
        !customParams.find(elem => elem.key === 'filtered_facet[by_regions]') &&
        !this.selectedFilters[AggregationFilterNames.REGIONS][Object.keys(this.selectedFilters[AggregationFilterNames.REGIONS])[0]]
      ) {
        customParams = [...customParams, { key: 'filtered_facet[by_regions]', value: qParams['regions[id][terms]'] }];
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
  moveToSearchResult(): void {
    document.getElementById('search-counters-label').focus();
  }

  /**
   * Back to search input for screen reader
   */
  backToSearchControl(): void {
    const elem = <HTMLElement>document.getElementsByClassName('search-suggest__input')[0];
    elem.focus();
  }

  /**
   * Gets list of datasets
   */
  protected getData(): void {
    if (this.featureFlagService.validateFlagSync('S43_geodata_map.fe')) {
      if (this.params['isMapOpen'] === 'true') {
        this.preparedParamsForDefaultLocation();
      }
    }

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

      if (this.featureFlagService.validateFlagSync('S43_geodata_map.fe')) {
        this.mapAggregations = response.aggregations;
        if (this.showMap) {
          this.refreshMap.next(true);
        }
        if (this.params['isMapOpen'] === 'true') {
          if (!this.params['regions[id][terms]']) {
            this.setParamsForMap(true);
          } else {
            this.setParamsForMap(false);
          }
        }
      }
    });
  }

  /**
   * Gets list of datasets from boundary box
   */
  getDataFromMap(event): void {
    if (event.data) {
      this.items = this.listViewDetailsService.extendViewDetails(event.data);
      this.counters = event.meta.aggregations.counters;
      this.count = event.meta.count;
      this.cdrf.detectChanges();
    } else {
      this.items = null;
    }
  }

  /**
   * show map event
   */
  onShowMap(): void {
    if (this.featureFlagService.validateFlagSync('S49_geodata_map_aggregation.fe')) {
      if (!this.mapAggregations.map_by_regions) {
        this.preparedParamsForDefaultLocation();

        this.searchService.getData(ApiConfig.search, this.params).subscribe(resp => {
          this.mapAggregations = resp.aggregations;
          this.setParamsForMap(true);
        });
      } else {
        this.setParamsForMap(false);
      }
    } else {
      if (!this.mapAggregations.by_tiles) {
        this.preparedParamsForDefaultLocation();

        this.searchService.getData(ApiConfig.search, this.params).subscribe(resp => {
          this.mapAggregations = resp.aggregations;
          this.setParamsForMap(true);
        });
      } else {
        this.setParamsForMap(false);
      }
    }
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
      [AggregationFilterNames.REGIONS]: {},
      [AggregationFilterNames.DYNAMIC_DATA]: {},
      [AggregationFilterNames.RESEARCH_DATA]: {},
    };
  }

  /**
   * returns count of selected filters
   * @return {number}
   */
  protected getSelectedFiltersCount(): number {
    if (this.featureFlagService.validateFlagSync('S43_geodata_map.fe')) {
      if (this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.REGIONS]) === 0) {
        this.showMap = false;
      }
    }

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
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.REGIONS]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.DYNAMIC_DATA]) +
      this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.RESEARCH_DATA]) +
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

  /**
   * prepared params for Poland location if location filter is unset
   */
  private preparedParamsForDefaultLocation(): void {
    if (!this.params['regions[id][terms]']) {
      this.params = {
        ...this.params,
        'regions[id][terms]': '85633723',
      };
      this.selectedFilters[AggregationFilterNames.REGIONS] = {
        '85633723': {
          bbox: [
            [14.122885, 54.836417],
            [24.145783, 49.002047],
          ],
        },
      };
    }
  }

  /**
   * set parameters for map
   * @param {boolean} isDefaultLocation
   */
  private setParamsForMap(isDefaultLocation: boolean): void {
    this.showMap = true;
    this.isDefaultLocation = isDefaultLocation;
  }
}
