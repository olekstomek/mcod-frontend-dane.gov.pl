import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DgaInformationPointTableComponent } from './dga-information-point-table/dga-information-point-table.component';
import { DgaInformationPointTabsComponent } from './dga-information-point-tabs/dga-information-point-tabs.component';
import { DgaInformationPointComponent } from './dga-information-point/dga-information-point.component';

import { DatasetModule } from '@app/pages';
import {
  DgaInformationPointCmsDetailsComponent
} from '@app/pages/dga-information-point/dga-information-point-cms-details/dga-information-point-cms-details.component';
import { DgaInformationPointRoutingModule } from '@app/pages/dga-information-point/dga-information-point-routing.module';
import { DgaInformationPointTablePageComponent } from '@app/pages/dga-information-point/dga-information-point-table-page/dga-information-point-table-page.component';
import {
  BreadcrumbsDgaInformationPointDataResolverService
} from '@app/shared/breadcrumbs/resolvers/breadcrumbs-dga-information-point-data-resolver.service';
import {
  BreadcrumbsDgaInformationPointTabDataResolverService
} from '@app/shared/breadcrumbs/resolvers/breadcrumbs-dga-information-point-tab-data-resolver.service';
import {
  BreadcrumbsDgaInformationPointTableDataResolverService
} from '@app/shared/breadcrumbs/resolvers/breadcrumbs-dga-information-point-table-data-resolver.service';
import { ResourceFilterModule } from '@app/shared/resource-filters/resource-filter.module';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [
    DgaInformationPointComponent,
    DgaInformationPointTabsComponent,
    DgaInformationPointCmsDetailsComponent,
    DgaInformationPointTablePageComponent,
    DgaInformationPointTableComponent
  ],
  imports: [
    CommonModule,
    DgaInformationPointRoutingModule,
    TranslateModule,
    SharedModule,
    ResourceFilterModule,
    DatasetModule
  ],
  providers: [
    BreadcrumbsDgaInformationPointDataResolverService,
    BreadcrumbsDgaInformationPointTabDataResolverService,
    BreadcrumbsDgaInformationPointTableDataResolverService
  ]
})
export class DgaInformationPointModule { }
