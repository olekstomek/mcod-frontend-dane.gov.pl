import { Injectable } from '@angular/core';
import { HttpParams } from '@angular/common/http';
import { Observable } from 'rxjs';
import { map, publishReplay, refCount } from 'rxjs/operators';

import { RestService } from '@app/services/rest.service';
import { ApiConfig, ApiResponse } from '@app/services/api';
import { TemplateHelper } from '@app/shared/helpers';
import { IHasImageThumbParams } from '@app/services/models/page-params';

/**
 * Application service handles backend connectivity for `\/applications` page
 */
@Injectable()
export class ApplicationsService extends RestService {
  /**
   * Get applications list from given filters in `params` variable
   * @param {IHasImageThumbParams} params
   * @param {key: string, value: string} additionalParameter
   * @returns {Observable<ApiResponse>}
   */
  // clean after remove S40_innovation_routing.fe
  getAll(params: IHasImageThumbParams, apiConfig: string, additionalParameter?: { key: string; value: string }): Observable<ApiResponse> {
    let httpParams = new HttpParams({ fromObject: params });
    if (additionalParameter) {
      httpParams = httpParams.append(additionalParameter.key, additionalParameter.value);
    }

    switch (apiConfig) {
      case 'application':
        return this.get(ApiConfig.applications, httpParams).pipe(
          map(response => {
            return new ApiResponse(response);
          }),
        );
        break;
      case 'showcases':
        return this.get(ApiConfig.showcases, httpParams).pipe(
          map(response => {
            return new ApiResponse(response);
          }),
        );
        break;
    }
  }

  /**
   * Get one application item by id
   * @param {string} id
   * @returns {Observable<any>}
   */
  // clean after remove S40_innovation_routing.fe
  getOne(id: string, apiConfig: string): Observable<any> {
    switch (apiConfig) {
      case 'application':
        return this.get(ApiConfig.applications + '/' + id).pipe(
          map(response => response['data']),
          publishReplay(1),
          refCount(),
        );
        break;
      case 'showcases':
        return this.get(ApiConfig.showcases + '/' + id).pipe(
          map(response => response['data']),
          publishReplay(1),
          refCount(),
        );
        break;
    }
  }

  /**
   * Get related datasets for a given application item
   * @param {string} id
   * @param {{}} params
   * @returns {Observable<ApiResponse>}
   */
  // clean after remove S40_innovation_routing.fe
  getDatasets(id: string, params = {}, apiConfig: string): Observable<ApiResponse> {
    let url: string;
    switch (apiConfig) {
      case 'application':
        url = TemplateHelper.parseUrl(ApiConfig.applicationsDatasets, { id: id });
        break;
      case 'showcases':
        url = TemplateHelper.parseUrl(ApiConfig.showcasesDatasets, { id: id });
        break;
    }

    const httpParams = new HttpParams({ fromObject: params });

    return this.get(url, httpParams).pipe(map(response => new ApiResponse(response)));
  }

  /**
   * Sends application data
   * @param {[key: string]: string} application
   * @returns {Observable<ApiResponse>}
   */
  // clean after remove S40_innovation_routing.fe
  suggest(application: { [key: string]: string }, apiConfig: string): Observable<ApiResponse> {
    const payload = `{
            "data": {
                "type": "application",
                "attributes": ${JSON.stringify(application)}
            }
        }`;

    switch (apiConfig) {
      case 'application':
        return this.post(ApiConfig.suggestApplication, JSON.parse(payload));
        break;
      case 'showcases':
        return this.post(ApiConfig.suggestShowcases, JSON.parse(payload));
        break;
    }
  }
}
