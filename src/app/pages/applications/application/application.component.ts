import { ActivatedRoute, Params, Router, QueryParamsHandling } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { ApplicationsService } from '@app/services/applications.service';
import { SeoService } from '@app/services/seo.service';
import { SearchService } from '@app/services/search.service';
import { ApiConfig } from '@app/services/api';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { BasicPageParams } from '@app/services/models/page-params';
import { ApiModel } from '@app/services/api/api-model';

/**
 * Application Component
 */
@Component({
    selector: 'app-application',
    templateUrl: './application.component.html'
})
export class ApplicationComponent implements OnInit {

    /**
     * API model 
     */
    apiModel = ApiModel;

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
    numPages = 0;

    /**
     * Page setting based on basic params and user interactions
     */
    params: Params;

    /**
     * Basic params of application component
     */
    basicParams: BasicPageParams = {
        sort: '-date',
        page: 1,
        q: '',
        per_page: 5
    };

    constructor(private activatedRoute: ActivatedRoute,
                private seoService: SeoService,
                private router: Router,
                private applicationsService: ApplicationsService,
                private searchService: SearchService,
                private filterService: ListViewFiltersService) {
    }

    /**
     * Updates query params on every user interaction
     * @param params
     * @param {QueryParamsHandling | null} method
     */
    updateParams(params: any, method: QueryParamsHandling | null = 'merge') {

        // empty search
        if (!('sort' in params) && params['sort'] && (('q' in params) && !(<string>params['q']).trim().length)) {
            return;
        } else if (('sort' in params) && !params['sort']) { // default sort
            params['sort'] = this.basicParams['sort'];
        }

        const updatedBasicParams = {
            page: +this.params['page'] || this.basicParams['page'],
            per_page: +this.params['per_page'] || this.basicParams['per_page'],
            q: this.params['q'] || '',
            sort: this.params['sort'] || ''
        };

        if (!('page' in params)) {
            params['page'] = 1;
        }

        this.router.navigate([], {
            queryParams: {
                ...updatedBasicParams,
                ...params
            }, queryParamsHandling: method
        });
    }

    /**
     * Checks whether default page params already exist
     * @param {Params} params
     * @returns {boolean}
     */
    private allBasicParamsIn(params: Params) {
        return this.filterService.allBasicParamsIn(params, this.basicParams);
    }

    /**
     * Sets META tags (title).
     * Initializes and updates list of items (applications) on query params change.
     */
    ngOnInit() {
        this.seoService.setPageTitleByTranslationKey(['Applications.Self']);

        this.activatedRoute.queryParams.subscribe((qParams: Params) => {
            let sort = '';

            if (!this.allBasicParamsIn(qParams)) {
                sort = qParams['q'] ? 'relevance' : this.basicParams['sort'];
            }

            this.params = { ...qParams, ...this.filterService.updateBasicParams(qParams, this.basicParams, sort) };

            if (!qParams['model[terms]']) {
                this.params['model[terms]'] = ApiModel.APPLICATION;
            }

            this.getData();
        });
    }

    /**
     * Gets list of applications
     */
    private getData() {
        this.searchService.getData(ApiConfig.search, this.params)
            .subscribe(response => {
                this.items = response.results;
                this.count = response.count;
            });
    }
}
