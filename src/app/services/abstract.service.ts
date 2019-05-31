import { Injectable } from '@angular/core';
import { RestService } from '@app/services/rest.service';

/**
 * Arbitrary service that extends RestService.
 */
@Injectable()
export class AbstractService extends RestService {

    /**
     * Request with GET Method to a given url
     * @param {string} url
     * @returns {Observable<any>}
     */
    public getRequest(url: string) {
        return this.get(url);
    }

}
