import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BreadcrumbsInstitutionResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-institution.resolver';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { InstitutionComponent } from './institution/institution.component';
import { InstitutionItemComponent } from './institution-item/institution-item.component';

const routes: Routes = [
    { path: '', component: InstitutionComponent },
    {
        path: '!:id',
        component: InstitutionItemComponent,
        data: {
            breadcrumbs: {dataKey: 'post.attributes.title'}
        },
        resolve: {
            post: BreadcrumbsInstitutionResolver
        }
    }
];

/**
 * @ignore
 */
@NgModule({
    imports: [
        RouterModule.forChild(routes),
        LocalizeRouterModule.forChild(routes),
    ],
    exports: [RouterModule, LocalizeRouterModule]
})
export class InstitutionsRoutingModule {
}
