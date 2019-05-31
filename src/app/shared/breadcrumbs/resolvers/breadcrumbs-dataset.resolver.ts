import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { empty } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { DatasetService } from '@app/services/dataset.service';

/**
 * Breadcrumbs Resolver for /datasets page
 */
@Injectable()
export class BreadcrumbsDatasetResolver implements Resolve<any> {

    /**
     * @ignore
     */
    constructor(private service: DatasetService) {
    }

    /**
     * Resolve data in routing data parameters
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        return this.service
            .getOneById(route.paramMap.get('id'))
            .pipe(
                catchError(() => empty())
            );
    }
}
