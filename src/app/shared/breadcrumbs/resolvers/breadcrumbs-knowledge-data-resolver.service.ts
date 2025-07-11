import { Injectable } from '@angular/core';
import { ActivatedRoute, ActivatedRouteSnapshot, Resolve, Router, RouterStateSnapshot } from '@angular/router';
import { EMPTY, Observable } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { CmsService } from '@app/services/cms.service';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { IPageCms } from '@app/services/models/cms/page-cms';

/**
 * Breadcrumbs Resolver for knowledgebase pages
 */
@Injectable()
export class BreadcrumbsKnowledgeBaseDataResolver implements Resolve<any> {
    /**
     * Router endpoints
     */
    readonly routerEndpoints = RouterEndpoints;

    constructor(private cmsService: CmsService, private activatedRoute: ActivatedRoute, private router: Router) {
    }

    /**
     * Resolve data in routing data parameters
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<IPageCms>>}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<IPageCms> {
        let rev: string;
        const lang = route.queryParams.lang;
        let url = '/' + this.routerEndpoints.KNOWLEDGE_BASE;

        if (route.data.details) {
            url = state.url.substring(3);
            rev = route.queryParams.rev;
        }
        return this.cmsService.getLandingPage(url, lang, rev).pipe(
            catchError((err) => {
                this.cmsService.displayCmsErrorMessage(url, err.message);
                this.router.navigate(['/']);
                return EMPTY;
            })
        );
    }
}
