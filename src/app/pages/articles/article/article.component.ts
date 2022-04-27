import { ActivatedRoute, Params, Router, QueryParamsHandling } from '@angular/router';
import { Component, OnInit } from '@angular/core';
import { CmsService } from '@app/services/cms.service';

import { SeoService } from '@app/services/seo.service';
import { APP_CONFIG } from '@app/app.config';
import { ICategoryPageParams, INewsPageParams } from '@app/services/models/page-params';
import { SearchService } from '@app/services/search.service';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { ApiConfig } from '@app/services/api';
import { ApiModel } from '@app/services/api/api-model';
import { FeatureFlagService } from '@app/services/feature-flag.service';

/**
 * Article Component
 */
@Component({
  selector: 'app-article',
  templateUrl: './article.component.html',
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
  // after remove S46_articles_form_cms.fe change params
  params: ICategoryPageParams | INewsPageParams;

  /**
   * Basic params of article component
   */
  // after remove S46_articles_form_cms.fe change basic params
  basicParams: ICategoryPageParams | INewsPageParams = {
    sort: '-date',
    page: 1,
    q: '',
    per_page: 5,
    'category[id]': 1,
  };

  /**
   * Max length of search input
   */
  maxLength = APP_CONFIG.searchInputMaxLength;

  /**
   * @ignore
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private seoService: SeoService,
    private router: Router,
    private searchService: SearchService,
    private filterService: ListViewFiltersService,
    private cmsService: CmsService,
    private featureflagService: FeatureFlagService,
  ) {}

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
        ...qParams,
        ...this.filterService.updateBasicParams(qParams, this.basicParams, sort),
      };

      if (this.featureflagService.validateFlagSync('S46_articles_form_cms.fe')) {
        if (!qParams['model[terms]']) {
          this.params['model[terms]'] = ApiModel.NEWS;
        }
        this.params = {
          ...this.params,
          ...{
            children_per_page: +qParams['per_page'] || this.basicParams['per_page'],
            children_page: +qParams['page'] || this.basicParams['page'],
            children_extra_fields: 'body,author,tags',
          },
        };
      } else {
        this.params = {
          ...this.params,
          ...{ 'category[id]': this.basicParams['category[id]'] },
        };

        if (!qParams['model[terms]']) {
          this.params['model[terms]'] = ApiModel.ARTICLE;
        }
      }

      this.getData();
    });
  }

  /**
   * Updates query params on every user interaction
   * @param params
   * @param {QueryParamsHandling | null} method
   */
  updateParams(params: any, search: boolean | null = false, method: QueryParamsHandling | null = 'merge') {
    // empty search
    if (!('sort' in params) && params['sort'] && 'q' in params && !(<string>params['q']).trim().length) {
      return;
    } else if ('sort' in params && !params['sort']) {
      // default sort
      params['sort'] = this.basicParams['sort'];
    }

    let updatedBasicParams;

    if (this.featureflagService.validateFlagSync('S46_articles_form_cms.fe')) {
      if (search) {
        updatedBasicParams = {
          page: +this.params['page'] || this.basicParams['page'],
          per_page: +this.params['per_page'] || this.basicParams['per_page'],
          q: this.params['q'] || '',
          sort: this.params['sort'] || '',
        };
      } else {
        updatedBasicParams = {
          children_page: +this.params['page'] || this.basicParams['page'],
          children_per_page: +this.params['per_page'] || this.basicParams['per_page'],
          q: this.params['q'] || '',
          sort: this.params['sort'] || '',
        };
      }
    } else {
      updatedBasicParams = {
        page: +this.params['page'] || this.basicParams['page'],
        per_page: +this.params['per_page'] || this.basicParams['per_page'],
        q: this.params['q'] || '',
        sort: this.params['sort'] || '',
        'category[id]': this.basicParams['category[id]'],
      };
    }
    if (!('page' in params)) {
      params['page'] = 1;
    }

    this.router.navigate([], {
      queryParams: {
        ...updatedBasicParams,
        ...params,
      },
      queryParamsHandling: method,
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
    this.searchService.getData(ApiConfig.search, this.params).subscribe(resp => {
      this.items = resp.results;
      this.count = resp.count;
    });
  }
}
