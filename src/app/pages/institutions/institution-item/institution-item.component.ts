import { ActivatedRoute, Router, Params } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { SeoService } from '@app/services/seo.service';
import { InstitutionsService } from '@app/services/institutions.service';
import { UserService } from '@app/services/user.service';
import { toggle, toggleVertically } from '@app/animations';
import { IInstitution } from '@app/services/models/institution';
import { AggregationFilterNames, AggregationOptionType, IListViewFilterAggregationsOptions } from '@app/services/models/filters';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import {
    IListViewInstitutionItemCategoryFiltersModel,
    IListViewInstitutionItemFiltersModel
} from '@app/services/models/page-filters/institution-item-filters';
import { ListViewSelectedFilterService } from '@app/services/list-view-selected-filter.service';
import { ListViewFilterPageAbstractComponent } from '@app/shared/filters/list-view-filter-page/list-view-filter-page.abstract.component';
import { ListViewDetailsService } from '@app/services/list-view-details.service';
import { SearchService } from '@app/services/search.service';
import { TemplateHelper } from '@app/shared/helpers';
import { ApiConfig } from '@app/services/api';
import { ApiModel } from '@app/services/api/api-model';
import { DatasetCategoriesHelper } from '@app/pages/dataset/dataset-categories-helper.service';

/**
 * Institution Item Component
 */
@Component({
    selector: 'app-institution-item',
    templateUrl: './institution-item.component.html',
    animations: [
        toggle,
        toggleVertically
    ]
})
export class InstitutionItemComponent extends ListViewFilterPageAbstractComponent implements OnInit {

    /**
     * API model 
     */
    apiModel = ApiModel;

    /**
     * All date filter fields in institution item page
     */
    readonly DateFields = [AggregationFilterNames.DATE_FROM, AggregationFilterNames.DATE_TO];

    /**
     * List of filter facets
     * @type {string[]}
     */
    readonly Facets;

    /**
     * Link to API
     */
    selfApi: string;

    /**
     * Institution  of institution item component
     */
    institution: IInstitution;

    /**
     * @ignore
     */
    constructor(protected filterService: ListViewFiltersService,
                protected activatedRoute: ActivatedRoute,
                private router: Router,
                public userService: UserService,
                private institutionsService: InstitutionsService,
                private seoService: SeoService,
                protected selectedFiltersService: ListViewSelectedFilterService,
                private listViewDetailsService: ListViewDetailsService,
                private searchService: SearchService,
                private categoriesHelper: DatasetCategoriesHelper) {
        super(filterService, activatedRoute, selectedFiltersService);
        this.Facets = [
            this.categoriesHelper.getOptionName(),
            AggregationOptionType.INSTITUTION,
            AggregationOptionType.FORMAT,
            AggregationOptionType.OPENNESS_SCORE,
            AggregationOptionType.VISUALIZATION_TYPE,
            AggregationOptionType.TYPES
        ];
    }

    /**
     * Sets META tags (title, description).
     * Initializes institution detail.
     * Initializes default filters.
     * Initializes and updates list of items (related datasets) on query params change.
     */
    ngOnInit() {
        this.institution = this.activatedRoute.snapshot.data.post;
        this.institution.count = this.institution.relationships ? this.institution.relationships.datasets.meta.count : 0;
        this.seoService.setPageTitle(this.institution.attributes.title);
        this.seoService.setDescriptionFromText(this.institution.attributes.description);

        const newModel = this.getFiltersModel();
        this.selectedFilters = { ...newModel };
        this.backupSelectedFilters = { ...newModel };


        const customParams = [
            { key: 'institution[id][terms]', value: +this.institution.id },
            { key: 'model[terms]', value: 'dataset,resource' }];

        this.activatedRoute.queryParams.subscribe((qParams: Params) => {
            let sort = '';

            if (!this.allBasicParamsIn(qParams)) {
                this.resetSelectedFilters();

                sort = qParams['q'] ? '' : '-date';
            }

            this.params = { ...qParams, ...this.filterService.updateBasicParams(qParams, this.basicParams, sort) };

            if (!qParams['model[terms]']) {
                this.params['model[terms]'] = 'dataset,resource';
            }

            this.params['institution[id][terms]'] = +this.institution.id;

            if (this.filters) {
                this.setSelectedFilters(qParams);
            }

            this.searchService.getFilters(ApiConfig.search, this.Facets, customParams)
                .subscribe((allFilters: IListViewFilterAggregationsOptions) => {
                    this.filters = allFilters;
                    this.setSelectedFilters(this.params);
                });

            this.getData();
        });
    }

    /**
     * Gets list of related datasets
     */
    protected getData() {
        this.searchService.getData(TemplateHelper.parseUrl(ApiConfig.search, { id: this.institution.id }), this.params)
            .subscribe(data => {
                this.counters = data.aggregations.counters;
                this.items = this.listViewDetailsService.extendViewDetails(data.results);
                this.count = data.count;
                this.selfApi = data.links.self;
            });
    }

    /**
     * returns new empty data model for filters
     * @returns {IListViewInstitutionItemFiltersModel}
     */
    protected getFiltersModel(): IListViewInstitutionItemFiltersModel | IListViewInstitutionItemCategoryFiltersModel  {
        // @ts-ignore
        return {
            [this.categoriesHelper.getFilterName()]: {}, [AggregationFilterNames.FORMAT]: {}, [AggregationFilterNames.OPENNESS_SCORE]: {},
            [AggregationFilterNames.VISUALIZATION_TYPE]: {}, [AggregationFilterNames.TYPES]: {},
            [AggregationFilterNames.DATE_FROM]: null, [AggregationFilterNames.DATE_TO]: null
        };
    }

    /**
     * returns count of selected filters
     * @return {number}
     */
    protected getSelectedFiltersCount(): number {
        return this.getSelectedFilterCount(this.backupSelectedFilters[this.categoriesHelper.getFilterName()]) +
            this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.FORMAT]) +
            this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.OPENNESS_SCORE]) +
            this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.VISUALIZATION_TYPE]) +
            this.getSelectedFilterCount(this.backupSelectedFilters[AggregationFilterNames.TYPES]) +
            (this.backupSelectedFilters[AggregationFilterNames.DATE_FROM] ||
            this.backupSelectedFilters[AggregationFilterNames.DATE_TO] ? 1 : 0);
    }
}
