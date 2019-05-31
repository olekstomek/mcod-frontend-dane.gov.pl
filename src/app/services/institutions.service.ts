import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';
import * as _ from 'underscore';

import { ApiConfig, ApiResponse } from '@app/services/api';
import { IFilters } from '@app/services/models/filters';
import { RestService } from '@app/services/rest.service';
import { TemplateHelper } from '@app/shared/helpers';

/**
 * Institutions sevice that handles communication with Institutions API `\/institutions`
 * @api https://api.dane.gov.pl/institutions
 */
@Injectable()
export class InstitutionsService extends RestService {

    /**
     * List of filter facets
     * @type {string[]}
     */
    facets = [
        'categories',
        'formats',
        'openness_scores'
    ];

    /**
     * Get list of institution items from given filters in `params` variable
     * @param {IFilters} params
     * @returns {Observable<ApiResponse>}
     */
    getAll(params: IFilters): Observable<ApiResponse> {

        let httpParams = new HttpParams({fromObject: params});
        httpParams = httpParams.append('facet', 'types');

        return this.get(ApiConfig.institutions, httpParams)
            .pipe(
                map(response => new ApiResponse(response))
            );
    }

    /**
     * Get one institution item from a given id
     * @param {string} id
     * @returns {Observable<any>}
     */
    getOne(id: string) {
        return this.get(ApiConfig.institutions + '/' + id)
            .pipe(
                map(response => response['data']),
                publishReplay(1),
                refCount()
            );
    }

    /**
     * Get list of datasets for given institution
     * @param {string} id
     * @param {{}} params
     * @returns {Observable<ApiResponse>}
     */
    getDatasets(id: string, params: IFilters): Observable<ApiResponse> {
        const url = TemplateHelper.parseUrl(ApiConfig.institutionDatasets, {id: id});

        let httpParams = new HttpParams({fromObject: params});
        httpParams = httpParams.append('facet', this.facets.join(','));

        return this.get(url, httpParams)
            .pipe(
                map(response => {

                    if (!response['meta']['aggs'])
                        return new ApiResponse(response);

                    const filters = {...response['meta']['aggs']};

                    for (const key in filters) {
                        if (filters[key]) {
                            if (filters[key].length)
                                if (key === 'by_category') {
                                    filters[key] = filters[key].sort((a, b) => {
                                        return a['title'].localeCompare(b['title']);
                                    });
                                } else
                                    filters[key] = _.sortBy(filters[key], 'title');
                            else
                                delete filters[key]; // remove empty filters
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

                    response['meta']['aggs'] = filters;


                    return new ApiResponse(response);
                })
            );
    }

}
