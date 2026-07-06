import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';

import { ApplicationItemComponent } from '@app/pages/applications/application-item/application-item.component';
import { ApplicationComponent } from '@app/pages/applications/application/application.component';
import { RoleGuard } from '@app/services/user-permissions/role.guard';
import { breadcrumbsAppsResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-apps.resolver';
import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';
import { PoCoToFormComponent } from '@app/shared/forms/form-pages/po-co-to-form/po-co-to-form.component';

const routes: Routes = [
  { path: '', component: ApplicationComponent },
  {
    path: '!suggest',
    component: PoCoToFormComponent,
    data: { breadcrumbs: { translationKey: 'Forms.PageHeader.Heading.PoCoTo', showFullBreadcrumb: true } },
  },
  {
    path: '!:id',
    component: ApplicationItemComponent,
    data: {
      breadcrumbs: { dataKey: 'post.attributes.title' },
    },
    resolve: {
      post: breadcrumbsAppsResolver,
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
      post: breadcrumbsAppsResolver,
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
