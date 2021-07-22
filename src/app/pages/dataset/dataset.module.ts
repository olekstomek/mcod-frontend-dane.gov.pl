import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { AccordionModule, TabsModule } from 'ngx-bootstrap';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { DatasetItemComponent } from './dataset-item/dataset-item.component';
import { DatasetComponent } from './dataset-page/dataset.component';
import { DatasetParentComponent } from './dataset-parent/dataset-parent.component';
import { DatasetResourceMapComponent } from './dataset-resource-map/dataset-resource-map.component';
import { DatasetResourceComponent } from './dataset-resource/dataset-resource.component';
import { DatasetRestrictionsComponent } from './dataset-restrictions/dataset-restrictions.component';
import { DatasetRoutingModule } from './dataset-routing.module';
import { FeedbackFormComponent } from './feedback-form/feedback-form.component';
import { ResourceItemFilesDownloadComponent } from './resource-list/resource-item-files-download/resource-item-files-download.component';
import { ResourceItemInfoComponent } from './resource-list/resource-item-info/resource-item-info.component';
import { ResourceListComponent } from './resource-list/resource-list.component';
import { SubmissionItemComponent } from './submission-item/submission-item.component';
import { SubmissionListComponent } from './submission-list/submission-list.component';
import { SuggestDatasetComponent } from './suggest-dataset/suggest-dataset.component';

import { AppBootstrapModule } from '@app/app-bootstrap/app-bootstrap.module';
import { DatasetListViewFiltersComponent } from '@app/pages/dataset/dataset-list-view-filters/dataset-list-view-filters.component';
import { DatasetService } from '@app/services/dataset.service';
import { BreadcrumbsDatasetResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-dataset.resolver';
import { BreadcrumbsResourceResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-resource.resolver';
import { BreadcrumbsSubmissionResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-submission.resolver';
import { OfflineResourceResolver } from '@app/shared/breadcrumbs/resolvers/offline-resource.resolver';
import { DatepickerModule } from '@app/shared/datepicker/datepicker.module';
import { MapModule } from '@app/shared/map/map.module';
import { ResourceChartModule } from '@app/shared/resource-chart/resource-chart.module';
import { SharedModule } from '@app/shared/shared.module';
import { DatasetMetadataComponent } from '@app/pages/dataset/dataset-metadata/dataset-metadata.component';

@NgModule({
    imports: [
        CommonModule,
        DatasetRoutingModule,
        AppBootstrapModule,
        TranslateModule.forChild({
            parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }
        }),
        FormsModule,
        SharedModule,
        DatepickerModule,
        MapModule,
        ResourceChartModule,
        DatepickerModule,
        TabsModule,
        AccordionModule,
        ReactiveFormsModule,
    ],
    providers: [
        DatasetService,
        BreadcrumbsDatasetResolver,
        BreadcrumbsSubmissionResolver,
        BreadcrumbsResourceResolver,
        OfflineResourceResolver
    ],
    declarations: [
        DatasetComponent,
        DatasetItemComponent,
        DatasetResourceComponent,
        DatasetParentComponent,
        SuggestDatasetComponent,
        DatasetResourceMapComponent,
        SuggestDatasetComponent,
        FeedbackFormComponent,
        DatasetRestrictionsComponent,
        DatasetListViewFiltersComponent,
        ResourceListComponent,
        ResourceItemInfoComponent,
        ResourceItemFilesDownloadComponent,
        SubmissionListComponent,
        SubmissionItemComponent,
        DatasetMetadataComponent
    ]
})
export class DatasetModule {
}
