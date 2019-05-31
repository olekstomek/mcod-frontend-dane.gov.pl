import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { AccordionModule, TabsModule } from 'ngx-bootstrap';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { AppBootstrapModule } from '@app/app-bootstrap/app-bootstrap.module';
import { DatasetService } from '@app/services/dataset.service';
import { SharedModule } from '@app/shared/shared.module';

import { DatasetRoutingModule } from './dataset-routing.module';
import { DatasetComponent } from './dataset-page/dataset.component';
import { DatasetItemComponent } from './dataset-item/dataset-item.component';
import { DatasetResourceComponent } from './dataset-resource/dataset-resource.component';
import { DatasetParentComponent } from './dataset-parent/dataset-parent.component';
import { BreadcrumbsDatasetResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-dataset.resolver';
import { BreadcrumbsResourceResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-resource.resolver';
import { SuggestDatasetComponent } from './suggest-dataset/suggest-dataset.component';

@NgModule({
    imports: [
        CommonModule,
        DatasetRoutingModule,
        AppBootstrapModule,
        TranslateModule.forChild({parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }}),
        FormsModule,
        SharedModule,
        TabsModule,
        AccordionModule,
        ReactiveFormsModule
    ],
    providers: [DatasetService, BreadcrumbsDatasetResolver, BreadcrumbsResourceResolver],
    declarations: [DatasetComponent, DatasetItemComponent, DatasetResourceComponent, DatasetParentComponent, SuggestDatasetComponent]
})
export class DatasetModule {}
