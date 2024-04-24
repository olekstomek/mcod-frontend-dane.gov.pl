import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';

import {
  DgaInformationPointCmsDetailsComponent
} from '@app/pages/dga-information-point/dga-information-point-cms-details/dga-information-point-cms-details.component';
import {
  DgaInformationPointTabsComponent
} from '@app/pages/dga-information-point/dga-information-point-tabs/dga-information-point-tabs.component';
import { DgaInformationPointComponent } from '@app/pages/dga-information-point/dga-information-point/dga-information-point.component';
import {
  BreadcrumbsDgaInformationPointDataResolverService
} from '@app/shared/breadcrumbs/resolvers/breadcrumbs-dga-information-point-data-resolver.service';
import {
  BreadcrumbsDgaInformationPointTabDataResolverService
} from '@app/shared/breadcrumbs/resolvers/breadcrumbs-dga-information-point-tab-data-resolver.service';

const routes: Routes = [
  {
    path: '',
    component: DgaInformationPointComponent,
    children: [
      {
        path: '',
        component: DgaInformationPointTabsComponent,
        children: [
          {
            path: '!:id',
            component: DgaInformationPointCmsDetailsComponent,
            data: { breadcrumbs: {dataKey: 'post.title'}},
            resolve: { post: BreadcrumbsDgaInformationPointDataResolverService }
          }
        ],
        resolve: { post: BreadcrumbsDgaInformationPointTabDataResolverService }
      }
    ]
  }
];

@NgModule({
  imports: [RouterModule.forChild(routes), LocalizeRouterModule.forChild(routes)],
  exports: [RouterModule, LocalizeRouterModule]
})
export class DgaInformationPointRoutingModule {}
