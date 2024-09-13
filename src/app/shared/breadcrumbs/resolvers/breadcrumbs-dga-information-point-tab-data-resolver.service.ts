import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { Observable } from 'rxjs';

import { CmsService } from '@app/services/cms.service';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';

@Injectable()
export class BreadcrumbsDgaInformationPointTabDataResolverService implements Resolve<any> {
  routerEndpoints = RouterEndpoints;
  constructor(private cmsService: CmsService) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const url = '/' + this.routerEndpoints.DGA;
    return this.cmsService.getLandingPage(url);
  }
}
