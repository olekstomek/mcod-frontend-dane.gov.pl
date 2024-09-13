import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { combineLatest, EMPTY, Observable, of } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';

import { CmsService } from '@app/services/cms.service';
import { DatasetService } from '@app/services/dataset.service';
import { DgaService } from '@app/services/dga.service';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';

@Injectable()
export class BreadcrumbsDgaInformationPointTableDataResolverService implements Resolve<Observable<any>> {

  readonly routerEndpoints = RouterEndpoints;

  constructor(
    private dgaService: DgaService,
    private datasetService: DatasetService,
    private cmsService: CmsService,
    private router: Router
  ) { }

  resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    return this.dgaService.getDgaAggregatedData().pipe(
      switchMap(data => this.getMoreData(data, route, state)),
      catchError((err) => {
        console.warn('Couldn\'t load data');
        this.router.navigate(['/']);
        return EMPTY;
    }));
  }

  getMoreData(data, route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<any> {
    const lang = route.queryParams.lang;
    const url = state.url.substring(3);
    const slicedUrl = url.slice(0, url.lastIndexOf('/'));
    const rev = route.queryParams.rev;

    return combineLatest([
      of(data),
      this.datasetService.getResourceById(data.resource_id),
      this.datasetService.getDatasetsStats(data.dataset_id, data.dataset_slug),
      this.cmsService.getLandingPage(slicedUrl, lang, rev)
    ]).pipe(map(([resData, resource, stats, cms]) => {
      return {
        resData,
        resource,
        stats,
        cms
      };
    }));
  }

}
