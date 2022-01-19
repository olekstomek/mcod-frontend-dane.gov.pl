import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { empty } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ApplicationsService } from '@app/services/applications.service';
import { ActivatedRouteHelper } from '@app/shared/helpers/activated-route.helper';
import { FeatureFlagService } from '@app/services/feature-flag.service';

/**
 * Breadcrumbs Resolver for /applications page
 */
@Injectable()
export class BreadcrumbsAppsResolver implements Resolve<any> {
  /**
   * @ignore
   */
  constructor(private service: ApplicationsService, private featureFlagService: FeatureFlagService) {}

  /**
   * Resolve data in routing data parameters
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (this.featureFlagService.validateFlagSync('S40_innovation_routing.fe')) {
      return this.service.getOne(ActivatedRouteHelper.getRoutingId(route), 'showcases').pipe(catchError(() => empty()));
    } else {
      return this.service.getOne(ActivatedRouteHelper.getRoutingId(route), 'application').pipe(catchError(() => empty()));
    }
  }
}
