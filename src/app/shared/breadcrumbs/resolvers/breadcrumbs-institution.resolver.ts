import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { empty } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { InstitutionsService } from '@app/services/institutions.service';
import { ActivatedRouteHelper } from '@app/shared/helpers/activated-route.helper';

/**
 * Breadcrumbs Resolver for /institutions page
 */
@Injectable()
export class BreadcrumbsInstitutionResolver implements Resolve<any> {

    constructor(private service: InstitutionsService) {
    }

    /**
     * Resolve data in routing data parameters
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        return this.service.getOne(ActivatedRouteHelper.getRoutingId(route))
            .pipe(
                catchError(() => empty())
            );
    }
}
