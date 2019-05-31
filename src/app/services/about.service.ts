import { Injectable } from '@angular/core';
import { RestService } from '@app/services/rest.service';
import { map } from 'rxjs/operators';

/**
 * About service
 */
@Injectable()
export class AboutService extends RestService {

    /**
     * Mock ping request, calls to api.*\/
     * @returns {Observable<any>}
     */
    getPong() {
        return this.get('/').pipe(map(a => a.result.response));
    }

}
