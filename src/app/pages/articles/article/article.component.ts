import { ActivatedRoute, Router } from '@angular/router';
import { Component, OnDestroy, OnInit } from '@angular/core';
import { QueryParamsHandling } from '@angular/router/src/config';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { SeoService } from '@app/services/seo.service';
import { ArticlesService } from '@app/services/articles.service';

/**
 * Article Component
 */
@Component({
    selector: 'app-article',
    templateUrl: './article.component.html'
})
export class ArticleComponent implements OnInit, OnDestroy {
    /**
     * Articles subscription of article component
     */
    articlesSubscription: Subscription;

    /**
     * Self api of article component
     */
    selfApi: string;

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
    numPages: number = 0;

    /**
     * Page setting based on basic params and user interactions
     */
    params: any;

    /**
     * Basic params of article component
     */
    basicParams = {
        sort: '-created',
        page: 1,
        q: '',
        per_page: 5,
        category: 1
    };

    /**
     * @ignore
     */    
    constructor(private activatedRoute: ActivatedRoute,
                private seoService: SeoService,
                private router: Router,
                private articlesService: ArticlesService) {
    }

    /**
     * Sets META tags (title). 
     * Initializes and updates list of items (articles) on query params change.
     */
    ngOnInit() {
        this.seoService.setSeoFromTranslation('Articles');

        this.articlesSubscription = this.activatedRoute.queryParamMap
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
                        sort: qParamMap.get('sort') || sort,
                        category: this.basicParams['category']
                    };
        
                    if (qParamMap.get('tags')) {
                        this.params['tags'] = qParamMap.get('tags');
                    }
    
                    return this.articlesService.getAll(this.params);
    
                })
            )
            .subscribe(response => {
                this.items = response.results;
                this.count = response.count;
                this.selfApi = this.articlesService.base_url + response.links.self;
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
            sort: this.params['sort'] || '',
            category: this.basicParams['category']
        }

        if ( !('page' in params) ) params['page'] = 1;

        this.router.navigate([], {queryParams: {
            ...updatedBasicParams,
            ...params
        }, queryParamsHandling: method});
    } 
   
    /**
     * Tracks list of items by single itme id to prevent re-rendering existing elements in the template
     * @param index 
     * @param item 
     * @returns id 
     */
    trackById(index, item) {
        return item.id;
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
     * Unsubscribe from existing subscriptions
     */
    ngOnDestroy() {
        this.articlesSubscription.unsubscribe();
    }
}
