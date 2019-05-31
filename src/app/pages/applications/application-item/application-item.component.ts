import { ActivatedRoute, Router } from '@angular/router';
import { QueryParamsHandling } from '@angular/router/src/config';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SeoService } from '@app/services/seo.service';
import { StringHelper } from '@app/shared/helpers/string.helper';
import { ApplicationsService } from '@app/services/applications.service';

/**
 * Application Item Component
 */
@Component({
    templateUrl: './application-item.component.html'
})
export class ApplicationItemComponent implements OnInit, OnDestroy {

    /**
     * Applications subscription of application item component
     */
    private applicationsSubscription: Subscription;

    /**
     * Application  of application item component
     */
    application;

    /**
     * Items (related datasets)
     */
    items: any[];

    /**
     * Determines whether item list is sorted by date
     */
    isSortedByDate: boolean = false;

    /**
     * Count of items (related datasets)
     */
    count: number;

    /**
     * Page setting based on basic params and user interactions
     */
    params: any;

    /**
     * Basic params of application item component
     */
    basicParams = {
        sort: '-verified',
        page: 1,
        q: '',
        per_page: 5
    };

    /**
     * @ignore
     */    
    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private applicationsService: ApplicationsService,
                private seoService: SeoService) {
    }

    /**
     * Sets META tags (title, description). 
     * Initializes application detail.
     * Initializes and updates list of items (related datasets) on query params change.
     */
    ngOnInit() {
        this.application = this.activatedRoute.snapshot.data.post;
        this.application.attributes.tags = this.application.attributes.tags.join(', ');

        this.seoService.setPageTitle(this.application.attributes.title);
        this.seoService.setDescriptionFromText(StringHelper.stripHtmlTags(this.application.attributes.notes));

        this.applicationsSubscription = this.activatedRoute.queryParamMap
            .pipe(
                switchMap(qParamMap => {
                    this.params = {
                        page: +qParamMap.get('page') || this.basicParams['page'],
                        per_page: +qParamMap.get('per_page') || this.basicParams['per_page'],
                        q: qParamMap.get('q') || '',
                        sort: qParamMap.get('sort') || this.basicParams['sort']
                    };
    
                    return this.applicationsService.getDatasets(this.application.id, this.params);
                })
            )
            .subscribe(data => {
                this.items = data.results;
                this.count = data.count;

                this.checkSortByDate();
            });
    }
    
    /**
     * Updates query params on every user interaction
     * @param params 
     * @param {QueryParamsHandling | null} method 
     */
    updateParams(params: any, method: QueryParamsHandling | null = 'merge') {
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
        this.applicationsSubscription.unsubscribe();
    }
}
