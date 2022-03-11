import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { CmsService } from '@app/services/cms.service';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { empty } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ArticlesService } from '@app/services/articles.service';
import { ActivatedRouteHelper } from '@app/shared/helpers/activated-route.helper';

/**
 * Breadcrumbs Resolver for /articles page
 */
@Injectable()
export class BreadcrumbsArticleResolver implements Resolve<any> {
  /**
   * @ignore
   */
  constructor(private service: ArticlesService, private featureFlagService: FeatureFlagService, private cmsService: CmsService) {}

  /**
   * Resolve data in routing data parameters
   * @param {ActivatedRouteSnapshot} route
   * @param {RouterStateSnapshot} state
   * @returns {any}
   */
  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
    if (this.featureFlagService.validateFlagSync('S46_articles_form_cms.fe')) {
      return this.cmsService.getNewsWidgets(route.params.id).pipe(catchError(() => empty()));
    } else {
      return this.service.getOne(ActivatedRouteHelper.getRoutingId(route)).pipe(catchError(() => empty()));
    }
  }
}
