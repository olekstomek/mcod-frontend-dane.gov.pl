import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { empty } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { InstitutionsService } from '@app/services/institutions.service';

/**
 * Breadcrumbs Resolver for /institutions page
 */
@Injectable()
export class BreadcrumbsInstitutionResolver implements Resolve<any> {

    /**
     * @ignore
     */
    constructor(private service: InstitutionsService) {
    }

    /**
     * Resolve data in routing data parameters
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        const id = route.paramMap.get('id');
        return this.service.getOne(id)
            .pipe(
                catchError(() => empty())
            );
    }
}
