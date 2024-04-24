import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { CmsService } from '@app/services/cms.service';
import { IPageCms } from '@app/services/models/cms/page-cms';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';

@Injectable()
export class BreadcrumbsDgaInformationPointDataResolverService implements Resolve<any> {

  readonly routerEndpoints = RouterEndpoints;

  constructor(private cmsService: CmsService, private activatedRoute: ActivatedRoute, private router: Router) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPageCms> {
    let rev: string;
    const lang = route.queryParams.lang;
    const url = state.url.substring(3);
    rev = route.queryParams.rev;

    return this.cmsService.getLandingPage(url, lang, rev).pipe(
      catchError((err) => {
        this.cmsService.displayCmsErrorMessage(url, err.message);
        this.router.navigate(['/']);
        return EMPTY;
      })
    );
  }
}
