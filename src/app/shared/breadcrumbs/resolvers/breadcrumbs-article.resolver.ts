import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CmsService } from '@app/services/cms.service';
import { empty } from 'rxjs';
import { catchError } from 'rxjs/operators';

/**
 * Breadcrumbs Resolver for /articles page
 */
@Injectable()
export class BreadcrumbsArticleResolver implements Resolve<any> {
  /**
   * @ignore
   */
  constructor(private cmsService: CmsService) {}

  /**
   * Resolve data in routing data parameters
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    return this.cmsService.getNewsWidgets(route.params.id).pipe(catchError(() => empty()));
  }
}
