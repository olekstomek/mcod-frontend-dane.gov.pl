import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { empty } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApplicationsService } from '@app/services/applications.service';

/**
 * Breadcrumbs Resolver for /applications page
 */
@Injectable()
export class BreadcrumbsAppsResolver implements Resolve<any> {

    /**
     * @ignore
     */
    constructor(private service: ApplicationsService) {
    }

    /**
     * Resolve data in routing data parameters
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        return this.service
            .getOne(route.paramMap.get('id'))
            .pipe(
                catchError(() => empty())
            );
    }
}
