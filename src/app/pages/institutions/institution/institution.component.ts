import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { QueryParamsHandling } from '@angular/router/src/config';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SeoService } from '@app/services/seo.service';
import { InstitutionsService } from '@app/services/institutions.service';
import { NotificationsService } from '@app/services/notifications.service';
import { toggle, toggleVertically } from '../../../animations/index';

/**
 * Institution Component
 */
@Component({
    selector: 'app-institution',
    templateUrl: './institution.component.html',
    animations: [
        toggle,
        toggleVertically
    ]
})
export class InstitutionComponent implements OnInit, OnDestroy {
    /**
     * Filters subscription of institution component
     */
    filtersSubscription: Subscription;
    
    /**
     * Institutions subscription of institution component
     */
    institutionsSubscription: Subscription;

    /**
     * Array of items (institutions)
     */
    items: Object[];

    /**
     * Count of items (institutions)
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
     * Basic params of institutions component
     */
    basicParams = {
        sort: 'title',
        page: 1,
        q: '',
        per_page: 16
    };

    /**
     * Filters  of institution component
     */
    filters: any;

    /**
     * Filters visibility indicator
     */
    filtersCollapsed: boolean = true;

    /**
     * Selected filters of institution component
     */
    selectedFilters: { types: any[] } = {types: []};
    
    /**
     * @ignore
     */
    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private institutionsService: InstitutionsService,
                private seoService: SeoService,
                private notificationsService: NotificationsService) {
    }

    /**
     * Sets META tags (title). 
     * Initializes default filters.
     * Initializes and updates list of items (institutions) on query params change.
     */
    ngOnInit() {
        this.seoService.setSeoFromTranslation('Institutions');

        // default filters
        this.filtersSubscription = this.institutionsService.getAll({ per_page: 1 })
            .subscribe(data => {
                this.filters = data.filters;
                const qTypes = this.activatedRoute.snapshot.queryParamMap.get('types');

                if (qTypes) {
                    this.selectedFilters.types = this.filters.by_type
                        .filter(item => qTypes.split(',').indexOf(item.key) !== -1);
                }
        });

        // institutions
        this.institutionsSubscription = this.activatedRoute.queryParamMap
            .pipe(
                switchMap(qParamMap => {
                    let sort = '';

                    if ( !this.allBasicParamsIn(qParamMap['params']) ) {
                        this.selectedFilters = {types: []};
                        sort = this.basicParams['sort'];
                    } 
    
                    this.params = {
                        page: +qParamMap.get('page') || this.basicParams['page'],
                        per_page: +qParamMap.get('per_page') || this.basicParams['per_page'],
                        q: qParamMap.get('q') || '',
                        sort: qParamMap.get('sort') || sort
                    };
    
                    if (qParamMap.get('types')) {
                        this.params['type__in'] = qParamMap.get('types').split(',').join('|');
                    }
    
                    return this.institutionsService.getAll(this.params);
                })
            )
            .subscribe(data => {
                this.count = data.count;
                this.items = data.results;

                this.items.map(item => {
                    item['count'] = item['relationships']['datasets']['links']['related']['meta']['count'];
                });
            },
            error => {
                if (error.message) {
                    this.notificationsService.addError(error.message);
                }
            });
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
        
        if (('sort' in params) && !params['sort']) { // default sort
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
     * @param {string} name 
     * @param {any[]} filterItems 
     */
    toggleFilter(name: string, filterItems: any[]) {
        if (filterItems.length) { 
            this.updateParams({[name]: filterItems.map(item => item.key).join(',')});
        } else { 
            const updatedQueryParams = {...this.activatedRoute.snapshot.queryParams}; 
            delete updatedQueryParams[name];

            this.updateParams(updatedQueryParams, null);
        }
    }

    /**
     * Clears selected filters
     */
    clearSelectedFilters() {
        this.selectedFilters = {types: []};
        this.updateParams({}, null);
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

        this.updateParams(updatedQueryParams, null);
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
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy() {
        this.filtersSubscription.unsubscribe();
        this.institutionsSubscription.unsubscribe();
    }
}
