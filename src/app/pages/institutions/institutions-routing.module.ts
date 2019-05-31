import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BreadcrumbsInstitutionResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-institution.resolver';
import { InstitutionComponent } from './institution/institution.component';
import { InstitutionItemComponent } from './institution-item/institution-item.component';

const routes: Routes = [
    { path: '', component: InstitutionComponent },
    {
        path: ':id', 
        component: InstitutionItemComponent, 
        data: { 
            breadcrumbs: '{{ post.attributes.title }}'
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
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class InstitutionsRoutingModule { }
