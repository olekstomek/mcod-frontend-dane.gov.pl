import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';
import { DgaInformationPointTabsComponent } from './dga-information-point-tabs/dga-information-point-tabs.component';
import { DgaInformationPointComponent } from './dga-information-point/dga-information-point.component';

import {
  DgaInformationPointCmsDetailsComponent
} from '@app/pages/dga-information-point/dga-information-point-cms-details/dga-information-point-cms-details.component';
import { DgaInformationPointRoutingModule } from '@app/pages/dga-information-point/dga-information-point-routing.module';
import {
  BreadcrumbsDgaInformationPointDataResolverService
} from '@app/shared/breadcrumbs/resolvers/breadcrumbs-dga-information-point-data-resolver.service';
import {
  BreadcrumbsDgaInformationPointTabDataResolverService
} from '@app/shared/breadcrumbs/resolvers/breadcrumbs-dga-information-point-tab-data-resolver.service';
import { SharedModule } from '@app/shared/shared.module';

@NgModule({
  declarations: [DgaInformationPointComponent, DgaInformationPointTabsComponent, DgaInformationPointCmsDetailsComponent],
  imports: [
    CommonModule,
    DgaInformationPointRoutingModule,
    TranslateModule,
    SharedModule
  ],
  providers: [
    BreadcrumbsDgaInformationPointDataResolverService,
    BreadcrumbsDgaInformationPointTabDataResolverService
  ]
})
export class DgaInformationPointModule { }
