import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { QueryParamsHandling } from '@angular/router/src/config';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { ApplicationsService } from '@app/services/applications.service';
import { SeoService } from '@app/services/seo.service';

/**
 * Application Component
 */
@Component({
    selector: 'app-application',
    templateUrl: './application.component.html'
})
export class ApplicationComponent implements OnInit, OnDestroy {
    /**
     * Data subscription of application component
     */
    dataSubscription: Subscription;

    /**
     * Self api of application component
     */
    selfApi: string;

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
    numPages: number = 0;

    /**
     * Page setting based on basic params and user interactions
     */
    params: any;

    /**
     * Basic params of application component
     */
    basicParams = {
        sort: '-modified',
        page: 1,
        q: '',
        per_page: 5
    };

    /**
     * @ignore
     */
    constructor(private activatedRoute: ActivatedRoute,
                private seoService: SeoService,
                private router: Router,
                private applicationsService: ApplicationsService) {
    }

    /**
     * Sets META tags (title). 
     * Initializes and updates list of items (applications) on query params change.
     */
    ngOnInit() {
        this.seoService.setSeoFromTranslation('Applications');

        this.dataSubscription = this.activatedRoute.queryParamMap
            .pipe(
                switchMap(qParamMap => {
                    let sort = '';
    
                    if ( !this.allBasicParamsIn(qParamMap['params']) ) {
                        sort = this.basicParams['sort'];
                    } 
        
                    this.params = {
                        page: +qParamMap.get('page') || this.basicParams['page'],
                        per_page: +qParamMap.get('per_page') || this.basicParams['per_page'],
                        q: qParamMap.get('q') || '',
                        sort: qParamMap.get('sort') || sort
                    };
        
                    if (qParamMap.get('tags')) {
                        this.params['tags'] = qParamMap.get('tags');
                    }
    
                    return this.applicationsService.getAll(this.params);
                })
            )
            .subscribe(response => {
                this.items = response.results;
                this.count = response.count;
                this.selfApi = this.applicationsService.base_url + response.links.self;
            });
    }

    /**
     * Updates query params on every user interaction
     * @param params 
     * @param {QueryParamsHandling | null} method 
     */
    updateParams(params: any, method: QueryParamsHandling | null = 'merge') {

        // empty search
        if (('sort' in params) && params['sort'] && (('q' in params) && !(<string>params['q']).trim().length)) {
            return;
        } else if (('sort' in params) && !params['sort']) { // default sort
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
        this.dataSubscription.unsubscribe();
    }
}
