import { Injectable } from '@angular/core';
import { ActivatedRouteSnapshot, Resolve, RouterStateSnapshot } from '@angular/router';
import { IMetadataPageChildrenCms } from '@app/services/models/cms/metadata-page-cms';
import { EMPTY, Observable, of } from 'rxjs';

/**
 * Breadcrumbs Resolver for knowledgebase tab pages
 */
@Injectable()
export class BreadcrumbsKnowledgeBaseTabDataResolverService implements Resolve<any> {
    /**
     * Resolve data in routing data parameters
     * @param {ActivatedRouteSnapshot} route
     * @param {RouterStateSnapshot} state
     * @returns {Observable<IMetadataPageChildrenCms>>}
     */
    resolve(route: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<Array<IMetadataPageChildrenCms>> {
        if (route.parent.data?.post?.meta?.children) {
            return of(route.parent.data.post.meta.children);
        }
        return EMPTY;
    }
}
