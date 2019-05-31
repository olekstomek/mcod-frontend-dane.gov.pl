import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { QueryParamsHandling } from '@angular/router/src/config';
import { Subscription } from 'rxjs';

import { DatasetService } from '@app/services/dataset.service';
import { SeoService } from '@app/services/seo.service';
import { toggle, toggleVertically } from '../../../animations/index';

/**
 * Dataset Component
 */
@Component({
    selector: 'app-dataset',
    templateUrl: './dataset.component.html',
    animations: [
        toggle,
        toggleVertically
    ]
})
export class DatasetComponent implements OnInit, OnDestroy {
    /**
     * Query params subscription of dataset component
     */
    queryParamsSubscription: Subscription;

    /**
     * Self api of dataset parent component
     */
    selfApi: string;

    /**
     * Array of items (datasets)
     */
    items: any[];

    /**
     * Determines whether item list is sorted by date
     */
    isSortedByDate: boolean = false;

    /**
     * Count of items (datasets)
     */
    count: number; 

    /**
     * Number of pagination pages
     */
    numPages: number = 0;

    /**
     * Page settings based on basic params and user interactions
     */
    params: any;

    /**
     * Basic params of dataset component
     */
    basicParams = {
        sort: '-verified',
        page: 1,
        q: '',
        per_page: 5
    };

    /**
     * Default filters  of dataset component
     */
    filters: any;

    /**
     * Default filters visibility indicator
     */
    filtersCollapsed = true;

    /**
     * Selected filters of dataset component
     */
    selectedFilters: { category: any, institution: any, formats: any, openness_scores: any } = {
        category: [], 
        institution: [], 
        formats: [], 
        openness_scores: []
    };

    /**
     * Selected filters count of dataset component
     */
    selectedFiltersCount: number = 0;

    /**
     * @ignore
     */    
    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private datasetService: DatasetService,
                private seoService: SeoService) {
    }

    /**
     * Sets META tags (title). 
     * Initializes default filters.
     * Initializes and updates list of items (datasets) on query params change.
     */    
    ngOnInit() {
        this.seoService.setSeoFromTranslation('Datasets');

        this.datasetService
            .getFilters()
            .subscribe(allFilters => {
                this.filters = allFilters;

                this.setSelectedFilters(this.activatedRoute.snapshot.queryParams);
                this.getDatasets();
        });

        this.queryParamsSubscription = this.activatedRoute.queryParams.subscribe(qParams => {
            let sort = '';

            if ( !this.allBasicParamsIn(qParams) ) {
                this.resetSelectedFilters();

                if (qParams['q'])
                    sort = '';
                else
                    sort = this.basicParams['sort'];
            } 

            this.params = {
                page: +qParams['page'] || this.basicParams['page'],
                per_page: +qParams['per_page'] || this.basicParams['per_page'],
                q: qParams['q'] || '',
                sort: qParams['sort'] || sort
            };

            if (qParams['tags']) {
                this.params.tags = qParams['tags'];
            }

            if (this.filters) {
                this.setSelectedFilters(qParams);
                this.getDatasets();
            }

            this.checkSortByDate();
        });
    }

    /**
     * Gets list of datasets 
     */
    getDatasets() {
        this.datasetService
            .getAll(this.params)
            .subscribe(response => {
                response.results.forEach(dataset => {
                    // TODO: move to dataset.service
                    dataset.institution = response.institutions.find(institution => {
                        return (
                            dataset.relationships.institution.data.type === 'institution' && 
                            +dataset.relationships.institution.data.id === institution.id
                        );
                    });
                });

                this.items = response.results;
                this.count = response.count;
                this.selfApi = this.datasetService.base_url + response.links.self;
            });
    }

    /**
     * Tracks list of items by single item id to prevent re-rendering of existing elements in the template
     * @param index 
     * @param item 
     * @returns id 
     */
    trackById(index, item) {
        return item.id;
    }

    /**
     * Performs search
     * @param params 
     */
    performSearch(params: any) {
        if (!('q' in params)) return;

        params['q'] = (<string>params['q']).trim();
        params['q'].length ? this.updateParams(params) : this.updateParams({q: ''});
    }

    /**
     * Updates query params on every user interaction
     * @param params 
     * @param {QueryParamsHandling | null} method 
     */
    updateParams(params: any, method: QueryParamsHandling | null = 'merge') {
        
        // default sort
        if (('sort' in params) && !params['sort']) { 
            params['sort'] = this.basicParams['sort'];
        }

        const updatedBasicParams = {
            page: +this.params['page'] || this.basicParams['page'],
            per_page: +this.params['per_page'] || this.basicParams['per_page'],
            q: this.params['q'] || '',
            sort: this.params['sort'] || ''
        }

        if ( !('page' in params) ) params['page'] = 1;

        this.router.navigate([], {queryParams: {
            ...updatedBasicParams,
            ...params
        }, queryParamsHandling: method});
    }

    /**
     * Toggles filter
     * @param name 
     * @param filterItems 
     */
    toggleFilter(name: string, filterItems: any[]) {
        this.selectedFilters[name] = filterItems = filterItems.filter(Boolean); 

        if (filterItems.length > 0) { 
            this.updateParams({[name]: filterItems.map(item => item.key).join(',')});
        } else { 
            const queryParams = {...this.activatedRoute.snapshot.queryParams}; 
            delete queryParams[name];
            this.updateParams(queryParams, null);
        }
    }

    /**
     * Sets selected filters based on query params
     * @param qParams 
     */
    setSelectedFilters(qParams): void {
        if (!this.filters) return;

        for (const name of Object.keys(this.selectedFilters)) {
            if (qParams[name]) {
                this.params[name + '__in'] = qParams[name].split(',').join('|');

                const filterValues = qParams[name].split(',').map(value => Number.isNaN(+value) ? value : +value);

                if (this.filters['by_' + name]) {
                    this.selectedFilters[name] = this.filters['by_' + name].filter(item => {
                        return filterValues.indexOf(Number.isNaN(item.key) ? item.key : +item.key) !== -1
                    });
                }

                if (name === 'formats' && !this.filters['by_' + name]) {
                    const formatValues = qParams[name].split(',').map(value => Number.isNaN(+value) ? value : +value);
                    this.selectedFilters[name] = this.filters['by_format'].filter(item => formatValues.indexOf(item.key) !== -1);
                }
            }
        }
        this.calculateSelectedFiltersCount();
    }

    /**
     * Clears selected filters
     */
    clearSelectedFilters() {
        this.resetSelectedFilters();
        this.updateParams({}, null);
    }

    /**
     * Resets selected filters
     */
    resetSelectedFilters() {
        this.selectedFilters = {category: [], institution: [], formats: [], openness_scores: []};
        this.calculateSelectedFiltersCount();
    }

    /**
     * Calculates selected filters count
     */
    calculateSelectedFiltersCount() {
        this.selectedFiltersCount = this.selectedFilters.category.length +
            this.selectedFilters.institution.length +
            this.selectedFilters.formats.length +
            this.selectedFilters.openness_scores.length;
    }

    /**
     * Removes selected filter
     * @param {string} name 
     * @param {number} index 
     */
    removeSelectedFilter(name: string, index: number) {
        const item = this.selectedFilters[name].splice(index, 1)[0];
        const updatedQueryParams = Object.assign({}, this.activatedRoute.snapshot.queryParams);

        const paramValues = updatedQueryParams[name].split(',').map(value => Number.isNaN(+value) ? value : +value);
        paramValues.splice(paramValues.indexOf(item.key), 1);

        if (paramValues.length > 0) {
            updatedQueryParams[name] = paramValues.join(',');
        } else {
            delete updatedQueryParams[name];
        }

        updatedQueryParams['page'] = 1;
        this.updateParams(updatedQueryParams, null);
    }

    /**
     * Checks whether default page params already exist
     * @param obj 
     * @returns {boolean}
     */
    allBasicParamsIn(obj) {
        for (let key of Object.keys(this.basicParams)) {
            if ( !(key in obj) ) {
                return false;
            }
        }
        return true;
    }

    /**
     * Checks whether item (result) list is sorted by date
     */
    checkSortByDate() {
        if (!this.params) return;

        if (this.params.sort.indexOf('created') !== -1 || this.params.sort.indexOf('verified') !== -1) {
            this.isSortedByDate = true;
        } else {
            this.isSortedByDate = false;
        }
    }

    /**
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy() {
        this.queryParamsSubscription.unsubscribe();
    }
}
