import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { BreadcrumbsDatasetResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-dataset.resolver';
import { DatasetParentComponent } from '@app/pages/dataset/dataset-parent/dataset-parent.component';
import { BreadcrumbsResourceResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-resource.resolver';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';

import { DatasetComponent } from './dataset-page/dataset.component';
import { DatasetItemComponent } from './dataset-item/dataset-item.component';
import { DatasetResourceComponent } from './dataset-resource/dataset-resource.component';
import { SuggestDatasetComponent } from './suggest-dataset/suggest-dataset.component';
import { DatasetResourceMapComponent } from '@app/pages/dataset/dataset-resource-map/dataset-resource-map.component';
import { ResourceChartComponent } from '@app/shared/resource-chart/resource-chart.component';
import { ResourceTableNoFiltersComponent } from '@app/shared/resource-table-no-filters/resource-table-no-filters.component';
import { RoleGuard } from '@app/services/user-permissions/role.guard';
import { Role } from '@app/shared/user-permissions/Role';
import { SubmissionListComponent } from './submission-list/submission-list.component';
import { SubmissionItemComponent } from './submission-item/submission-item.component';
import { BreadcrumbsSubmissionResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-submission.resolver';
import { OfflineResourceResolver } from '@app/shared/breadcrumbs/resolvers/offline-resource.resolver';

const routes: Routes = [
  { path: '', component: DatasetComponent },
  { path: '!sparql', loadChildren: () => import('./sparql/sparql.module').then(m => m.SparqlModule) },
  { path: '!submissions', component: SuggestDatasetComponent },
  { path: '!submissions/!accepted', component: SubmissionListComponent },
  {
    path: '!submissions/!accepted/!:id',
    component: SubmissionItemComponent,
    data: {
      breadcrumbs: { dataKey: 'post.data.attributes.title' },
    },
    resolve: {
      post: BreadcrumbsSubmissionResolver,
    },
  },
  {
    path: '!:id',
    component: DatasetParentComponent,
    data: {
      breadcrumbs: { dataKey: 'post.data.attributes.title' },
    },
    resolve: {
      post: BreadcrumbsDatasetResolver,
    },
    children: [
      {
        path: '',
        component: DatasetItemComponent,
        resolve: {
          post: OfflineResourceResolver,
        },
      },
      {
        path: '!resource/!:resourceId',
        component: DatasetResourceComponent,
        data: {
          breadcrumbs: { dataKey: 'post.attributes.title' },
        },
        resolve: {
          post: BreadcrumbsResourceResolver,
        },
        children: [
          { path: '', redirectTo: '!table', pathMatch: 'full' },
          {
            path: '!table',
            component: ResourceTableNoFiltersComponent,
            resolve: {
              post: OfflineResourceResolver,
            },
          },
          { path: '!chart', component: ResourceChartComponent },
          { path: '!map', component: DatasetResourceMapComponent },
        ],
      },
      {
        path: '!resource/!:resourceId/!preview',
        component: DatasetResourceComponent,
        data: {
          breadcrumbs: { dataKey: 'post.attributes.title' },
          editorPreview: true,
          roles: [Role.ADMIN, Role.EDITOR],
        },
        resolve: {
          post: BreadcrumbsResourceResolver,
        },
        canActivate: [RoleGuard],
        children: [
          { path: '', redirectTo: '!table', pathMatch: 'full' },
          { path: '!table', component: ResourceTableNoFiltersComponent },
          { path: '!chart', component: ResourceChartComponent },
          { path: '!map', component: DatasetResourceMapComponent },
        ],
      },
    ],
  },
];

/**
 * @ignore
 */
@NgModule({
  imports: [RouterModule.forChild(routes), LocalizeRouterModule.forChild(routes)],
  exports: [RouterModule, LocalizeRouterModule],
})
export class DatasetRoutingModule {}
