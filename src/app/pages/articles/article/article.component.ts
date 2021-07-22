import { ActivatedRoute, Params, Router, QueryParamsHandling } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { SeoService } from '@app/services/seo.service';
import { APP_CONFIG } from '@app/app.config';
import { ICategoryPageParams } from '@app/services/models/page-params';
import { SearchService } from '@app/services/search.service';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { ApiConfig } from '@app/services/api';
import { ApiModel } from '@app/services/api/api-model';

/**
 * Article Component
 */
@Component({
    selector: 'app-article',
    templateUrl: './article.component.html'
})
export class ArticleComponent implements OnInit {

    /**
     * API model 
     */
    apiModel = ApiModel;

    /**
     * Items (articles from one category - news)
     */
    items: any[];

    /**
     * Count  of items (articles)
     */
    count: number;

    /**
     * Number of pagination pages
     */
    numPages = 0;

    /**
     * Page setting based on basic params and user interactions
     */
    params: ICategoryPageParams;

    /**
     * Basic params of article component
     */
    basicParams: ICategoryPageParams = {
        sort: '-date',
        page: 1,
        q: '',
        per_page: 5,
        'category[id]': 1
    };

    /**
     * Max length of search input
     */
    maxLength = APP_CONFIG.searchInputMaxLength;

    /**
     * @ignore
     */
    constructor(private activatedRoute: ActivatedRoute,
                private seoService: SeoService,
                private router: Router,
                private searchService: SearchService,
                private filterService: ListViewFiltersService) {
    }

    /**
     * Sets META tags (title).
     * Initializes and updates list of items (articles) on query params change.
     */
    ngOnInit() {
        this.seoService.setPageTitleByTranslationKey(['Articles.News']);

        this.activatedRoute.queryParams.subscribe((qParams: Params) => {
            let sort = '';

            if (!this.allBasicParamsIn(qParams)) {
                sort = qParams['q'] ? 'relevance' : this.basicParams['sort'];
            }

            this.params = {
                ...qParams, ...this.filterService.updateBasicParams(qParams, this.basicParams, sort),
                ...{ 'category[id]': this.basicParams['category[id]'] }
            };

            if (!qParams['model[terms]']) {
                this.params['model[terms]'] = ApiModel.ARTICLE;
            }

            this.getData();
        });
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
            sort: this.params['sort'] || '',
            'category[id]': this.basicParams['category[id]']
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
    private allBasicParamsIn(params: Params): boolean {
        return this.filterService.allBasicParamsIn(params, this.basicParams);
    }

    /**
     * Gets list of articles
     */
    private getData() {
        this.searchService.getData(ApiConfig.search, this.params)
            .subscribe(response => {
                this.items = response.results;
                this.count = response.count;
            });
    }
}
