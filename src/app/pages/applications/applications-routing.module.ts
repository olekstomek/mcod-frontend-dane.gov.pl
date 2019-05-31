import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicationComponent } from '@app/pages/applications/application/application.component';
import { ApplicationItemComponent } from '@app/pages/applications/application-item/application-item.component';
import { BreadcrumbsAppsResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-apps.resolver';
import { SuggestApplicationComponent } from './suggest-application/suggest-application.component';

const routes: Routes = [
    { path: '', component: ApplicationComponent },
    { path: 'suggest', component: SuggestApplicationComponent },
    {
        path: ':id', 
        component: ApplicationItemComponent, 
        data: {
            breadcrumbs: '{{ post.attributes.title }}'
        },
        resolve: {
            post: BreadcrumbsAppsResolver
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
export class ApplicationsRoutingModule {}
