import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, ParamMap, Params, Router, QueryParamsHandling } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { switchMap } from 'rxjs/operators';

import { SeoService } from '@app/services/seo.service';
import { SearchService } from '@app/services/search.service';
import { NotificationsService } from '@app/services/notifications.service';
import { ISearchCounters, ISearchResponse } from '@app/services/models/search';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { ListViewDetailsService } from '@app/services/list-view-details.service';
import { ApiModel } from '@app/services/api/api-model';
import { FeatureFlagService } from '@app/services/feature-flag.service';

@Component({
  selector: 'app-search-results',
  templateUrl: './search-results.component.html',
})
export class SearchResultsComponent implements OnInit {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * Router endpoints
   */
  readonly routerEndpoints = RouterEndpoints;

  /**
   * Count of items (any type)
   */
  totalCount: number;

  /**
   * Counters of items by type
   */
  counters: ISearchCounters;

  /**
   * Search results
   */
  results: any[];

  /**
   * Number of pagination pages
   */
  numPages = 0;

  /**
   * Basic params of institutions component
   */
  basicParams = {
    sort: 'relevance',
    page: 1,
    q: '',
    per_page: 20,
  };

  constructor(
    private activatedRoute: ActivatedRoute,
    private seoService: SeoService,
    private router: Router,
    private searchService: SearchService,
    private notificationsService: NotificationsService,
    private listViewDetailsService: ListViewDetailsService,
    private localizeRouterService: LocalizeRouterService,
    private featureFlagsService: FeatureFlagService,
  ) {}

  /**
   * Sets META tags (title).
   * Initializes and updates list of items on query params change.
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Search.Results']);

    this.basicParams = { ...this.basicParams, ...this.activatedRoute.snapshot.queryParams };

    this.searchService.search(this.basicParams).subscribe(resp => this.setCounterAndResults(resp));

    this.activatedRoute.queryParamMap
      .pipe(
        switchMap((qParamMap: ParamMap) => {
          this.basicParams = {
            page: +qParamMap.get('page') || this.basicParams['page'],
            per_page: +qParamMap.get('per_page') || this.basicParams['per_page'],
            q: qParamMap.get('q') || '',
            sort: qParamMap.get('sort') || this.basicParams['sort'],
          };
          return this.searchService.search(this.basicParams);
        }),
      )
      .subscribe(
        (resp: ISearchResponse) => this.setCounterAndResults(resp),
        error => {
          if (error.message) {
            this.notificationsService.addError(error.message);
          }
        },
      );
  }

  /**
   * Updates query params on every user interaction
   * @param resp {ISearchResponse}
   */
  setCounterAndResults(resp: ISearchResponse) {
    this.counters = resp.meta.aggregations.counters;
    this.totalCount = resp.meta.count;
    if (this.featureFlagsService.validateFlagSync('S39_innovation_view.fe')) {
      this.results = this.listViewDetailsService.extendViewDetails(resp.data).filter(data => data.attributes.model !== 'application');
    } else {
      this.results = this.listViewDetailsService.extendViewDetails(resp.data).filter(data => data.attributes.model !== 'showcase');
    }
  }

  /**
   * Updates query params on user interaction
   * @param {Params} params
   * @param {QueryParamsHandling | null} method
   */
  updateParams(params: Params, method: QueryParamsHandling | null = 'merge') {
    if (!('page' in params)) {
      params['page'] = 1;
    }
    this.basicParams = { ...this.basicParams, ...params };
    this.router.navigate(this.localizeRouterService.translateRoute(['/!search']) as [], {
      queryParams: this.basicParams,
      queryParamsHandling: method,
    });
  }
}
