import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

import { SeoService } from '@app/services/seo.service';
import { InstitutionsService } from '@app/services/institutions.service';
import { toggle, toggleVertically } from '@app/animations';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { ListViewSelectedFilterService } from '@app/services/list-view-selected-filter.service';
import { AggregationFilterNames, AggregationOptionType, IListViewFilterAggregationsOptions } from '@app/services/models/filters';
import { IListViewInstitutionFiltersModel } from '@app/services/models/page-filters/institution-filters';
import { ListViewFilterPageAbstractComponent } from '@app/shared/filters/list-view-filter-page/list-view-filter-page.abstract.component';
import { IInstitutionSource, InstitutionSourceType } from '@app/services/models/institution';
import { SearchService } from '@app/services/search.service';
import { ApiConfig } from '@app/services/api';
import { ApiModel } from '@app/services/api/api-model';

/**
 * Institution Component
 */
@Component({
  selector: 'app-institution',
  templateUrl: './institution.component.html',
  animations: [toggle, toggleVertically],
})
export class InstitutionComponent extends ListViewFilterPageAbstractComponent implements OnInit {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * Link to API
   */
  selfApi: string;

  /**
   * List of filter facets
   * @type {string[]}
   */
  readonly Facets = [AggregationOptionType.INSTITUTION_TYPE];

  constructor(
    protected filterService: ListViewFiltersService,
    protected activatedRoute: ActivatedRoute,
    protected selectedFiltersService: ListViewSelectedFilterService,
    private router: Router,
    private institutionsService: InstitutionsService,
    private seoService: SeoService,
    private searchService: SearchService,
  ) {
    super(filterService, activatedRoute, selectedFiltersService);
  }

  /**
   * Sets META tags (title).
   * Initializes and updates list of items (institutions) on query params change.
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Institutions.Self']);

    const newModel = this.getFiltersModel();
    this.selectedFilters = { ...newModel };
    this.backupSelectedFilters = { ...newModel };

    this.activatedRoute.queryParams.subscribe((qParams: Params) => {
      let sort = '';

      if (!this.allBasicParamsIn(qParams)) {
        this.resetSelectedFilters();

        sort = qParams['q'] ? 'relevance' : 'title';
      }

      this.params = { ...qParams, ...this.filterService.updateBasicParams(qParams, this.basicParams, sort) };

      if (!qParams['model[terms]']) {
        this.params['model[terms]'] = this.apiModel.INSTITUTION;
      }

      if (this.filters) {
        this.setSelectedFilters(qParams);
      }

      this.searchService.getFilters(ApiConfig.search, this.Facets).subscribe((allFilters: IListViewFilterAggregationsOptions) => {
        this.filters = allFilters;
        this.setSelectedFilters(this.params);
      });

      this.getData();
    });
  }

  protected getData() {
    this.searchService.getData(ApiConfig.search, this.params).subscribe(response => {
      this.items = response.results.map(item => {
        item['source'] =
          item.attributes.sources &&
          item.attributes.sources.find((source: IInstitutionSource) => source.source_type === InstitutionSourceType.CKAN);
        return item;
      });
      this.count = response.count;
      this.selfApi = response.links.self;
    });
  }

  /**
   * returns new empty data model for filters
   * @returns {IListViewInstitutionFiltersModel}
   */
  protected getFiltersModel(): IListViewInstitutionFiltersModel {
    return { [AggregationFilterNames.INSTITUTION_TYPE]: {} };
  }

  /**
   * returns count of selected filters
   * @return {number}
   */
  protected getSelectedFiltersCount(): number {
    return this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.INSTITUTION_TYPE]);
  }
}
