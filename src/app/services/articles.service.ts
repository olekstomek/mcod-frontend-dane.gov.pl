import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { CmsService } from '@app/services/cms.service';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { RestService } from '@app/services/rest.service';
import { ApiConfig, ApiResponse } from '@app/services/api';
import { ICategoryPageParams } from '@app/services/models/page-params';

/**
 * Articles Services that handles communication with Articles API `\/articles`
 */
@Injectable()
export class ArticlesService extends RestService {
  /**
   * Get articles list from given filters in `params` variable
   * @param {ICategoryPageParams} params
   * @returns {Observable<ApiResponse>}
   */
  getAll(params: ICategoryPageParams): Observable<ApiResponse> {
    if (params.category) {
      params['category[id]'] = params.category;
      delete params.category;
    }

    const httpParams = new HttpParams({ fromObject: params });

    return this.get(ApiConfig.articles, httpParams).pipe(
      map(response => {
        return new ApiResponse(response);
      }),
    );
  }

  /**
   * Get one article item with given id
   * @param {string} id
   * @returns {any}
   */
  getOne(id: string) {
    return this.get(ApiConfig.articles + '/' + id).pipe(
      map(response => response['data']),
      publishReplay(1),
      refCount(),
    );
  }
}
