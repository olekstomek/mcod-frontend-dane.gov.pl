import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ApplicationComponent } from '@app/pages/applications/application/application.component';
import { ApplicationItemComponent } from '@app/pages/applications/application-item/application-item.component';
import { RoleGuard } from '@app/services/user-permissions/role.guard';
import { BreadcrumbsAppsResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-apps.resolver';
import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { SuggestApplicationComponent } from './suggest-application/suggest-application.component';

const routes: Routes = [
  { path: '', component: ApplicationComponent },
  {
    path: '!suggest',
    component: SuggestApplicationComponent,
    data: { breadcrumbs: { translationKey: 'Breadcrumbs.SuggestApplicationComponent' } },
  },
  {
    path: '!:id',
    component: ApplicationItemComponent,
    data: {
      breadcrumbs: { dataKey: 'post.attributes.title' },
    },
    resolve: {
      post: BreadcrumbsAppsResolver,
    },
  },
  {
    path: '!preview/!:id',
    component: ApplicationItemComponent,
    canActivate: [RoleGuard],
    data: {
      breadcrumbs: '{{ post.attributes.title }}',
      roles: PermissionPerRoles.PREVIEW_UNPUBLISHED_APPLICATION,
    },
    resolve: {
      post: BreadcrumbsAppsResolver,
    },
  },
];

/**
 * @ignore
 */
@NgModule({
  imports: [RouterModule.forChild(routes), LocalizeRouterModule.forChild(routes)],
  exports: [RouterModule, LocalizeRouterModule],
})
export class ApplicationsRoutingModule {}
