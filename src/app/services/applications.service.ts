import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

import { RestService } from '@app/services/rest.service';
import { ApiConfig, ApiResponse } from '@app/services/api';
import { IFilters } from '@app/services/models/filters';
import { TemplateHelper } from '@app/shared/helpers';

/**
 * Application service handles backend connectivity for `\/applications` page
 */
@Injectable()
export class ApplicationsService extends RestService {

    /**
     * Get applications list from given filters in `params` variable
     * @param params
     * @returns {Observable<ApiResponse>}
     */
    getAll(params: IFilters): Observable<ApiResponse> {
        const httpParams = new HttpParams({fromObject: params});

        return this.get(ApiConfig.applications, httpParams)
            .pipe(map(response => {
                return new ApiResponse(response);
            }));
    }

    /**
     * Get one application item by id
     * @param {string} id
     * @returns {Observable<any>}
     */
    getOne(id: string): Observable<any> {
        return this.get(ApiConfig.applications + '/' + id)
            .pipe(
                map(response => response['data']),
                publishReplay(1),
                refCount());
    }

    /**
     * Follow changes of a given application item
     * Only for logged in users (requires api_key)
     * @param {string} id
     * @returns {Observable<any>}
     */
    followOne(id: string) {
        const url = TemplateHelper.parseUrl(ApiConfig.applicationFollow, {id: id});
        return this.post(url);
    }

    /**
     * Unfollow changes of a given application item
     * Only for logged in users (requires api_key)
     * @param {string} id
     * @returns {Observable<any>}
     */
    unfollowOne(id: string) {
        const url = TemplateHelper.parseUrl(ApiConfig.applicationFollow, {id: id});
        return this.delete(url);
    }

    /**
     * Get followed applications list with givent parameters
     * Only for logged in users (requires api_key)
     * @param {{}} params
     * @returns {Observable<any>}
     */
    getFollowed(params = {}) {
        const httpParams = new HttpParams({fromObject: params});
        return this.get(ApiConfig.followedApplications, httpParams);
    }

    /**
     * Get related datasets for a given application item
     * @param {string} id
     * @param {{}} params
     * @returns {Observable<ApiResponse>}
     */
    getDatasets(id: string, params = {}): Observable<ApiResponse> {
        const url = TemplateHelper.parseUrl(ApiConfig.applicationsDatasets, {id: id});
        const httpParams = new HttpParams({fromObject: params});

        return this.get(url, httpParams)
            .pipe(map(response => new ApiResponse(response)));
    }

    suggest(application: Object) {
        const url = TemplateHelper.parseUrl(ApiConfig.suggestApplication, {});
        return this.post(url, application);
    }
}
