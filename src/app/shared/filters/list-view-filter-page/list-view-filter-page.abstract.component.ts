import {
  SelectedFilter,
  IListViewFilterAggregationsOptions,
  MultiselectOption,
  SingleselectOptionForRegions,
} from '@app/services/models/filters';
import { IListViewApplicationsFiltersModel } from '@app/services/models/page-filters/applications-filters';
import { IListViewDatasetFiltersModel } from '@app/services/models/page-filters/dataset-filters';
import { IListViewInstitutionFiltersModel } from '@app/services/models/page-filters/institution-filters';
import { ActivatedRoute, Params, QueryParamsHandling } from '@angular/router';
import { APP_CONFIG } from '@app/app.config';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { BasicPageParams, PageParams } from '@app/services/models/page-params';
import { ListViewSelectedFilterService } from '@app/services/list-view-selected-filter.service';
import {
  IListViewInstitutionItemCategoryFiltersModel,
  IListViewInstitutionItemFiltersModel,
} from '@app/services/models/page-filters/institution-item-filters';
import { ISearchCounters } from '@app/services/models/search';
import { FeatureFlagService } from '@app/services/feature-flag.service';

/**
 * Abstract class for page which uses List View filters
 */
export abstract class ListViewFilterPageAbstractComponent {
  /**
   * Stored selected filters
   */
  backupSelectedFilters:
    | IListViewDatasetFiltersModel
    | IListViewInstitutionFiltersModel
    | IListViewInstitutionItemFiltersModel
    | IListViewInstitutionItemCategoryFiltersModel
    | IListViewApplicationsFiltersModel;

  /**
   * Selected filters
   */
  selectedFilters:
    | IListViewDatasetFiltersModel
    | IListViewInstitutionFiltersModel
    | IListViewInstitutionItemFiltersModel
    | IListViewInstitutionItemCategoryFiltersModel
    | IListViewApplicationsFiltersModel;

  /**
   * Default filters of dataset component
   */
  filters: IListViewFilterAggregationsOptions;

  /**
   * Selected filters count
   */
  selectedFiltersCount = 0;

  /**
   * Array of items
   */
  items: any[];

  /**
   * Count of items
   */
  count: number;

  /**
   * Number of pagination pages
   */
  numPages = 0;

  /**
   * Page settings based on basic params and user interactions
   */
  params: Params;

  /**
   * Basic params of dataset component
   */
  basicParams: BasicPageParams = {
    sort: 'relevance',
    page: 1,
    q: '',
    per_page: 20,
  };

  /**
   * Max length of search input
   */
  maxLength = APP_CONFIG.searchInputMaxLength;

  /**
   * Counters of items by type
   */
  counters: ISearchCounters;

  /**
   * Abstract date filter fields
   */
  readonly DateFields = [];

  /**
   * initial value for region input (after refresh if exists)
   */
  initialRegionValue: string;

  constructor(
    protected filterService: ListViewFiltersService,
    protected activatedRoute: ActivatedRoute,
    protected selectedFiltersService: ListViewSelectedFilterService,
    protected featureFlagService: FeatureFlagService,
  ) {}

  /**
   * Clears selected filter and updates query
   * @param { SelectedFilter} filter
   */
  clearSelectedFilter(filter: SelectedFilter, isMapOpen?: boolean) {
    switch (filter.names) {
      case 'has_high_value_data':
        this.disabledCheckbox(0);
        break;
      case 'has_dynamic_data':
        this.disabledCheckbox(2);
        break;
      case 'has_research_data':
        if (this.featureFlagService.validateFlagSync('S47_research_data_filter.fe')) {
          this.disabledCheckbox(4);
        }
        break;
    }
    let updatedQueryParams: PageParams = this.selectedFiltersService.removeSelectedFilter(
      filter,
      this.activatedRoute.snapshot.queryParams,
      this.backupSelectedFilters,
    );
    if (this.featureFlagService.validateFlagSync('S42_geodata_search.fe')) {
      if (filter.names === 'regions') {
        (<HTMLInputElement>document.getElementById('regions-search-input')).value = '';
        this.initialRegionValue = '';
        updatedQueryParams = { ...updatedQueryParams, isMapOpen: isMapOpen };
      }
    }

    this.filterService.updateParams(updatedQueryParams, null, this.basicParams, this.params);
  }

  disabledCheckbox(index: number): void {
    document.getElementById(`chk-${index}`).removeAttribute('disabled');
    document.getElementById(`chk-${index + 1}`).removeAttribute('disabled');
  }

  /**
   * Performs search
   * @param {BasicPageParams} params
   */
  performSearch(params: BasicPageParams) {
    this.filterService.performSearch(params, this.basicParams, this.params);
  }

  /**
   * Clears selected filters
   */
  clearSelectedFilters() {
    this.resetSelectedFilters();
    this.updateParams({}, null);
  }

  /**
   * Updates query params on every user interaction
   * @param params
   * @param {QueryParamsHandling | null} method
   * @param {boolean} shouldAddSuffix
   */
  updateParams(params: PageParams, method: QueryParamsHandling | null = 'merge', shouldAddSuffix = false) {
    let preparedParams: PageParams;
    if (shouldAddSuffix) {
      preparedParams = this.filterService.prepareParamsBeforeUpdate(params, this.DateFields);
    } else {
      preparedParams = params;
    }
    this.filterService.updateParams(preparedParams, method, this.basicParams, this.params);
  }

  /**
   * Sets selected filters based on query params
   * @param {PageParams} queryParams
   */
  protected setSelectedFilters(queryParams: PageParams) {
    const newSelectedFilters = this.filterService.setSelectedFilters(
      queryParams,
      this.DateFields,
      this.filters,
      this.selectedFilters,
      this.params,
    );

    this.backupSelectedFilters = { ...newSelectedFilters } as IListViewDatasetFiltersModel;
    this.selectedFilters = { ...newSelectedFilters } as IListViewDatasetFiltersModel;
    this.selectedFiltersCount = this.getSelectedFiltersCount();
    if (this.featureFlagService.validateFlagSync('S42_geodata_search.fe')) {
      if (this.selectedFilters.regions && !this.selectedFilters.regions[Object.keys(this.selectedFilters.regions)[0]].hierarchy_label) {
        this.initialRegionValue = this.selectedFilters.regions[Object.keys(this.selectedFilters.regions)[0]].title;
      }
    }
  }

  /**
   * Resets selected filters
   */
  protected resetSelectedFilters() {
    this.backupSelectedFilters = this.getFiltersModel();
    this.selectedFiltersCount = 0;
    this.resetHighValueDataFilterCheckboxes();
    this.resetDynamicDataFilterCheckboxes();

    if (this.featureFlagService.validateFlagSync('S47_research_data_filter.fe')) {
      this.resetResearchDataFilterCheckboxes();
    }

    if (this.featureFlagService.validateFlagSync('S42_geodata_search.fe')) {
      const regionsSearchInput = <HTMLInputElement>document.getElementById('regions-search-input');
      if (regionsSearchInput) {
        (<HTMLInputElement>document.getElementById('regions-search-input')).value = '';
        this.initialRegionValue = '';
      }
    }
  }

  /**
   * Resets high value data disabled checkbox for filters
   */
  protected resetHighValueDataFilterCheckboxes() {
    const hasHighValueDataInputNo = document.getElementById('chk-0');
    const hasHighValueDataInputYes = document.getElementById('chk-1');
    if (hasHighValueDataInputNo?.hasAttribute('disabled')) {
      hasHighValueDataInputNo.removeAttribute('disabled');
    }
    if (hasHighValueDataInputYes?.hasAttribute('disabled')) {
      hasHighValueDataInputYes.removeAttribute('disabled');
    }
  }

  protected resetDynamicDataFilterCheckboxes() {
    const hasDynamicDataInputNo = document.getElementById('chk-2');
    const hasDynamicDataInputYes = document.getElementById('chk-3');
    if (hasDynamicDataInputNo?.hasAttribute('disabled')) {
      hasDynamicDataInputNo.removeAttribute('disabled');
    }
    if (hasDynamicDataInputYes?.hasAttribute('disabled')) {
      hasDynamicDataInputYes.removeAttribute('disabled');
    }
  }

  protected resetResearchDataFilterCheckboxes() {
    const hasResearchDataInputNo = document.getElementById('chk-4');
    const hasResearchDataInputYes = document.getElementById('chk-5');
    if (hasResearchDataInputNo?.hasAttribute('disabled')) {
      hasResearchDataInputNo.removeAttribute('disabled');
    }
    if (hasResearchDataInputYes?.hasAttribute('disabled')) {
      hasResearchDataInputYes.removeAttribute('disabled');
    }
  }

  /**
   * Checks whether default page params already exist
   * @param {Params} params
   * @returns {boolean}
   */
  protected allBasicParamsIn(params: Params): boolean {
    return this.filterService.allBasicParamsIn(params, this.basicParams);
  }

  /**
   * gets one particular selected filter count
   * @param {MultiselectOption} filters
   */
  protected getSelectedFilterCount(filters: MultiselectOption | SingleselectOptionForRegions) {
    return filters ? Object.keys(filters).length : 0;
  }

  /**
   * Abstract function for getting results
   */
  protected abstract getData();

  /**
   * Abstract function for getting filter model
   */
  protected abstract getFiltersModel();

  /**
   * Abstract function for getting selected filters count
   */
  protected abstract getSelectedFiltersCount();
}
