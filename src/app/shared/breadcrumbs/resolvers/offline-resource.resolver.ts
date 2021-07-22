import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { empty } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';

/**
 * Offline Resolver for /datasets/resources page
 */
@Injectable()
export class OfflineResourceResolver implements Resolve<any> {

    /**
     * Resolve data in routing data parameters
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        if (!!!route.parent.data.post) {
            return empty();
        }
        return of(route.parent.data.post);
    }
}
