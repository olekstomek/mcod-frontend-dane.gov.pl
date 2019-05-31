import { ActivatedRoute, Router, ParamMap } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { QueryParamsHandling } from '@angular/router/src/config';
import { Subscription } from 'rxjs';

import { SeoService } from '@app/services/seo.service';
import { InstitutionsService } from '@app/services/institutions.service';
import { UserService } from '@app/services/user.service';
import { toggle, toggleVertically } from '../../../animations/index';

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
export class InstitutionItemComponent implements OnInit, OnDestroy {
    /**
     * Filters subscription of institution item component
     */
    private filtersSubscription: Subscription;

    /**
     * Datasets subscription of institution item component
     */
    private queryParamsSubscription: Subscription;

    /**
     * Institution  of institution item component
     */
    institution;

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
     * Page setting based on basic params and user interactions
     */
    params: any;

    /**
     * Basic params of institution item  component
     */
    basicParams = {
        sort: '-verified',
        page: 1,
        q: '',
        per_page: 5
    };

    /**
     * Default filters  of institution item component
     */
    filters;

    /**
     * Default filters visibility of institution item component
     */
    filtersCollapsed: boolean = true;

    /**
     * Selected filters of institution item component
     */
    selectedFilters: { category: any, formats: any, openness_scores: any } = {
        category: [], 
        formats: [], 
        openness_scores: []
    };

    /**
     * Selected filters count of institution item component
     */
    selectedFiltersCount: number = 0;

    /**
     * @ignore
     */
    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                public userService: UserService,
                private institutionsService: InstitutionsService,
                private seoService: SeoService) {
    }

    /**
     * Sets META tags (title, description). 
     * Initializes institution detail.
     * Initializes default filters.
     * Initializes and updates list of items (related datasets) on query params change.
     */
    ngOnInit() {
        this.institution = this.activatedRoute.snapshot.data.post;
        this.institution['count'] = this.institution['relationships']['datasets']['links']['related']['meta']['count'];

        this.seoService.setPageTitle(this.institution.attributes.title);
        this.seoService.setDescriptionFromText(this.institution.attributes.description);

        // default filters
        this.filtersSubscription =  this.institutionsService
            .getDatasets(this.institution.id, {per_page: 1})
            .subscribe(data => {
                this.filters = data.filters;

                this.setSelectedFilters(this.activatedRoute.snapshot.queryParamMap);
                this.getDatasets();
        });

        this.queryParamsSubscription = this.activatedRoute.queryParamMap
            .subscribe(qParamMap => {
                let sort = '';

                if( !this.allBasicParamsIn(qParamMap['params']) ) {
                    this.resetSelectedFilters();
                    sort = this.basicParams['sort'];
                }

                this.params = {
                    page: +qParamMap.get('page') || this.basicParams['page'],
                    per_page: +qParamMap.get('per_page') || this.basicParams['per_page'],
                    q: qParamMap.get('q') || '',
                    sort: qParamMap.get('sort') || sort
                };

                if (qParamMap.get('tags')) {
                    this.params.tags = qParamMap.get('tags');
                }

                for (const param of Object.keys(this.selectedFilters)) {
                    const qParam = qParamMap.get(param);

                    if (qParam) {
                        param === 'openness_score' ?
                            this.params[param + '__gte'] = qParam.split(',').join('|') :
                            this.params[param + '__in'] = qParam.split(',').join('|');
                    }
                }

                if (this.filters) {
                    this.setSelectedFilters(qParamMap);
                    this.getDatasets();
                }

                this.checkSortByDate();
            });
    }

    /**
     * Gets list of related datasets 
     */
    getDatasets() {
        this.institutionsService
            .getDatasets(this.institution.id, this.params)
            .subscribe(data => {
                this.items = data.results;
                this.count = data.count;
            });
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
        this.calculateSelectedFiltersCount();

        if (filterItems.length > 0) { 
            this.updateParams({[name]: filterItems.map(item => item.key).join(',')});
        
        } else { 
            const updatedQueryParams = {...this.activatedRoute.snapshot.queryParams}; 
            delete updatedQueryParams[name];
            this.updateParams(updatedQueryParams, null);
        }
    }

    /**
     * Sets selected filters based on query params
     * @param qParams 
     */
    setSelectedFilters(qParamMap: ParamMap) {
        for (const name of Object.keys(this.selectedFilters)) {
            const byName = (name === 'formats') ? 'by_format' : 'by_' + name;

            if (qParamMap.get(name) && this.filters[byName]) {
                this.selectedFilters[name] = this.filters[byName]
                    .filter(item => qParamMap.get(name).split(',')
                        .map(j => Number.isNaN(+j) ? j : +j)
                        .indexOf(item.key) !== -1);
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
        this.selectedFilters = {category: [], formats: [], openness_scores: []};
        this.calculateSelectedFiltersCount();
    }   

    /**
     * Calculates selected filters count
     */
    calculateSelectedFiltersCount() {
        this.selectedFiltersCount = this.selectedFilters.category.length +
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
        this.calculateSelectedFiltersCount();

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
        this.filtersSubscription.unsubscribe();
        this.queryParamsSubscription.unsubscribe();
    }
}
