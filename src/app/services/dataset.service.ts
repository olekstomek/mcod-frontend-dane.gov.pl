import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import * as _ from 'underscore';

import { RestService } from '@app/services/rest.service';
import { ApiConfig, ApiResponse } from '@app/services/api';
import { TemplateHelper } from '@app/shared/helpers';
import { IFilters } from '@app/services/models/filters';

/**
 *  Dataset services that handles communication with Dataset API `\/datasets`
 */
@Injectable()
export class DatasetService extends RestService {

    /**
     * List of filter facets
     * @type {string[]}
     */
    facets = [
        'categories',
        'institutions',
        'formats',
        'openness_scores'
    ];

    /**
     * Get list of dataset items from given filters in `params` variable
     * @param params
     * @returns {Observable<ApiResponse>}
     */
    getAll(params: IFilters): Observable<ApiResponse> {
        const httpParams = new HttpParams({fromObject: params});

        return this.get(ApiConfig.datasets, httpParams)
            .pipe(map(response => {
                    return new ApiResponse(response);
                })
                , publishReplay(1)
                , refCount()
            );
    }

    /**
     * Get list of available filter values from facets set in class root
     * @returns {Observable<any>}
     */
    getFilters() {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('per_page', '1');
        httpParams = httpParams.append('facet', this.facets.join(','));

        return this.get(ApiConfig.datasets, httpParams)
            .pipe(
                map(response => {
                    const filters = response['meta']['aggs'];

                    for (const key in filters) {
                        if (filters[key]) {
                            if (key === 'by_category') {
                                filters[key] = filters[key].sort((a, b) => {
                                    return a['title'].localeCompare(b['title']);
                                });
                            } else
                                filters[key] = _.sortBy(filters[key], 'title');
                        }
                    }

                    if (filters['by_openness_scores']) {
                        filters['by_openness_scores'].forEach(item => {
                            item.title = '';
                            item.hiddenLabel = 'Attribute.OpennessScore';

                            for (let i = 0; i < 5; i++) {
                                item.title += i < +item.key ? '&#x2605; ' : '&#x2606; ';
                            }
                        });
                    }

                    return filters;
                }),
                publishReplay(1),
                refCount()
            );
    }

    /**
     * Get one dataset item from a given id
     * @param {string} id
     * @returns {Observable<any>}
     */
    getOneById(id: string) {
        return this.get(ApiConfig.datasets + '/' + id);
    }

    /**
     * Get changes history for a given dataset id with page number and number of items per page
     * @param {string} id
     * @param {number} page
     * @param {number} per_page
     * @returns {any}
     */
    getHistoryById(id: string, page: number = 1, per_page: number = 10) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('table_name', 'dataset');
        httpParams = httpParams.append('row_id', id);
        httpParams = httpParams.append('page', page.toString());
        httpParams = httpParams.append('sort', '-change_timestamp');
        httpParams = httpParams.append('per_page', per_page.toString());

        return this.get(ApiConfig.history, httpParams).pipe(
            publishReplay(1),
            refCount()
        );
    }

    /**
     * Get list of resources for given dataset id
     * @param {string} id
     * @param params
     * @returns {Observable<ApiResponse>}
     */
    getResourcesList(id: string, params: any = {}): Observable<ApiResponse> {
        const url = TemplateHelper.parseUrl(ApiConfig.resources, {id: id});

        return this.get(url, params).pipe(
            map(response => new ApiResponse(response))
        );
    }

    /**
     * Get specific resource for given id
     * @param {string} resourceId
     * @returns {Observable<any>}
     */
    getResourceById(resourceId: string) {
        const url = TemplateHelper.parseUrl(ApiConfig.resourceDetails, {resourceId: resourceId});

        return this.get(url)
            .pipe(map(data => data['data']));
    }

    /**
     * Increase download counter for resource with given id
     * @param {string} resourceId
     * @returns {Observable<any>}
     */
    tickDownloadCounter(resourceId: string) {
        const url = TemplateHelper.parseUrl(ApiConfig.resourceDownload, {resourceId: resourceId});

        return this.put(url);
    }

    /**
     * Get table contents of resource with given id
     * @param {string} resourceId
     * @returns {Observable<any>}
     */
    getResourceDataById(resourceId: string) {
        const url = TemplateHelper.parseUrl(ApiConfig.resourceData, {resourceId: resourceId});

        return this.get(url)
            .pipe(map(data => data['data']));
    }

    /**
     * Follow changes of dataset with given id
     * Only logged in users
     * @param {string} id
     * @returns {Observable<any>}
     */
    followOne(id: string) {
        const url = TemplateHelper.parseUrl(ApiConfig.datasetFollow, {id: id});
        return this.post(url);
    }

    /**
     * Stop following changes of dataset with given id
     * Only logged in users
     * @param {string} id
     * @returns {Observable<any>}
     */
    unfollowOne(id: string) {
        const url = TemplateHelper.parseUrl(ApiConfig.datasetFollow, {id: id});
        return this.delete(url);
    }

    /**
     * Get list of datasets that are followed by user
     * Only logged in users
     * @param {{}} params
     * @returns {Observable<any>}
     */
    getFollowed(params = {}) {
        const httpParams = new HttpParams({fromObject: params});
        return this.get(ApiConfig.followedDatasets, httpParams);
    }

    /**
     * Send feedback message to dataset owner
     * @param {string} id
     * @param {string} feedback
     * @returns {Observable<any>}
     */
    sendDatasetFeedback(id: string, feedback: string) {
        const url = TemplateHelper.parseUrl(ApiConfig.datasetFeedback, {id: id});
        return this.post(url, feedback);
    }

    /**
     * Send feedback message to dataset owner
     * @param {string} id
     * @param {string} feedback
     * @returns {Observable<any>}
     */
    sendResourceFeedback(id: string, feedback: string) {
        const url = TemplateHelper.parseUrl(ApiConfig.resourceFeedback, {resourceId: id});
        return this.post(url, feedback);
    }

    /**
     * Sends dataset submission
     * @param {string} submission 
     * @returns {Observable<any>} 
     */
    sendSubmission(submission: string) {
        return this.post(ApiConfig.submissions, submission);
    }
}
