import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { empty } from 'rxjs';
import { catchError } from 'rxjs/operators';

import { ArticlesService } from '@app/services/articles.service';

/**
 * Breadcrumbs Resolver for /articles page
 */
@Injectable()
export class BreadcrumbsArticleResolver implements Resolve<any> {

    /**
     * @ignore
     */
    constructor(private service: ArticlesService) {
    }

    /**
     * Resolve data in routing data parameters
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {any}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): any {
        return this.service
            .getOne(route.paramMap.get('id'))
            .pipe(
                catchError(() => {
                    return empty();
                })
            );
    }
}
