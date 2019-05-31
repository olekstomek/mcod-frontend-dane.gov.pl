import { Injectable } from '@angular/core';
import { ApiConfig } from '@app/services/api';
import { TemplateHelper } from '@app/shared/helpers';
import { HttpParams } from '@angular/common/http';
import { RestService } from '@app/services/rest.service';
import { Resources } from '@app/services/api/resources.enum';
import { IFilters } from '@app/services/models/filters';

/**
 * General following changes service that handles API communication
 */
@Injectable()
export class ObserveService extends RestService {

    /**
     * Follow changes of a given resource with specific id
     * Only for logged in users (requires api_key)
     * @param {string} resource
     * @param {string} id
     * @returns {Observable<any>}
     */
    followOne(resource: string, id: string) {

        const url = this.getUrl(resource, {id: id});
        return this.post(url);
    }

    /**
     * Stop following changes of a given resource with specific id
     * Only for logged in users (requires api_key)
     * @param {string} resource
     * @param {string} id
     * @returns {Observable<any>}
     */
    unfollowOne(resource: string, id: string) {
        const url = this.getUrl(resource, {id: id});
        return this.delete(url);
    }

    /**
     * Get followed items of a given resource
     * Only for logged in users (requires api_key)
     * @param {string} resource
     * @param {{}} params
     * @returns {Observable<any>}
     */
    getFollowed(resource: string, params: IFilters) {
        const httpParams = new HttpParams({fromObject: params});
        let url: string = '';
        switch (resource) {
            case Resources.application:
                url = ApiConfig.followedApplications;
                break;
            case Resources.dataset:
                url = ApiConfig.followedDatasets;
                break;
            case Resources.article:
                url = ApiConfig.followedArticles;
                break;
        }

        return this.get(url, httpParams);
    }

    /**
     * Parse url for the given resource
     * @param {string} resource
     * @param params
     * @returns {string}
     */
    private getUrl(resource: string, params: any) {
        switch (resource) {
            case Resources.application:
                return TemplateHelper.parseUrl(ApiConfig.applicationFollow, params);
            case Resources.dataset:
                return TemplateHelper.parseUrl(ApiConfig.datasetFollow, params);
            case Resources.article:
                return TemplateHelper.parseUrl(ApiConfig.articleFollow, params);
        }
    }

}
