import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { map, publishReplay, refCount } from 'rxjs/operators';
import { Observable } from 'rxjs';

import { RestService } from '@app/services/rest.service';
import { ApiConfig, ApiResponse } from '@app/services/api';
import { TemplateHelper } from '@app/shared/helpers';
import { IFilters } from '@app/services/models/filters';

/**
 * Articles Services that handles communication with Articles API `\/articles`
 */
@Injectable()
export class ArticlesService extends RestService {

    /**
     * Get articles list from given filters in `params` variable
     * @param params
     * @returns {Observable<ApiResponse>}
     */
    getAll(params: IFilters): Observable<ApiResponse> {
        const httpParams = new HttpParams({fromObject: params});

        return this.get(ApiConfig.articles, httpParams)
            .pipe(
                map(response => {
                    return new ApiResponse(response);
                })
            );
    }

    /**
     * Get one article item with given id
     * @param {string} id
     * @returns {any}
     */
    getOne(id: string) {
        return this.get(ApiConfig.articles + '/' + id)
            .pipe(
                map(response => response['data']),
                publishReplay(1), refCount()
            );
    }

    /**
     * Follow changes of a given article item
     * Only for logged in users (requires api_key)
     * @param {string} id
     * @returns {Observable<any>}
     */
    followOne(id: string) {
        const url = TemplateHelper.parseUrl(ApiConfig.articleFollow, {id: id});
        return this.post(url);
    }

    /**
     * Unfollow changes of a given article item
     * Only for logged in users (requires api_key)
     * @param {string} id
     * @returns {Observable<any>}
     */
    unfollowOne(id: string) {
        const url = TemplateHelper.parseUrl(ApiConfig.articleFollow, {id: id});
        return this.delete(url);
    }

    /**
     * Get list of followed articles
     * Only for logged in users (requires api_key)
     * @param {IFilters} params
     * @returns {Observable<any>}
     */
    getFollowed(params: IFilters) {
        const httpParams = new HttpParams({fromObject: params});
        return this.get(ApiConfig.followedArticles, httpParams);
    }
}
