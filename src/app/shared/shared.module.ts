import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { SanitizeHtmlPipe } from '@app/shared/pipes/sanitize-html.pipe';
import { TextToLinksPipe } from '@app/shared/pipes/text-to-links.pipe';
import { PaginationComponent } from './pagination/pagination.component';
import { DatagridComponent } from './datagrid/datagrid.component';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { FilterPipe } from './pipes/filter.pipe';

import '@app/shared/helpers/string.helper';
import { PasswordStrengthComponent } from './password-strength/password-strength.component';
import { TooltipModule } from 'ngx-bootstrap';
import { NotificationsComponent } from './notifications/notifications.component';
import { BreadcrumbsComponent } from '@app/shared/breadcrumbs/breadcrumbs.component';
import { MultiselectComponent } from '@app/shared/multiselect/multiselect.component';
import { SingleselectComponent } from './singleselect/singleselect.component';
import { StripHtmlPipe } from '@app/shared/pipes/strip-html.pipe';
import { WriteUsInfoComponent } from './write-us-info/write-us-info.component';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { DateFormatPipe } from './pipes/date-format.pipe';
import { TruncateTextPipe } from './pipes/truncate-text.pipe';
import { FocusTrapDirective } from './directives/focus-trap/focus-trap.directive';
import { TimespanPipe } from '@app/shared/pipes/timespan.pipe';
import { StarRatingComponent } from './star-rating/star-rating.component';
import { ObserveButtonComponent } from './observe-button/observe-button.component';
import { HistoryEntryComponent } from './history-entry/history-entry.component';
import { KeysPipe } from '@app/shared/pipes/keys.pipe';
import { DatasetAutocompleteDirective } from './directives/dataset-autocomplete.directive';
import { TranslateDateFormatPipe } from './pipes/translate-date-format.pipe';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        TooltipModule,
        TranslateModule.forChild({parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }}),
    ],
    declarations: [
        SanitizeHtmlPipe,
        StripHtmlPipe,
        FilterPipe,
        KeysPipe,
        PaginationComponent,
        DatagridComponent,
        PasswordStrengthComponent,
        NotificationsComponent,
        BreadcrumbsComponent,
        MultiselectComponent,
        SingleselectComponent,
        WriteUsInfoComponent,
        TimespanPipe,
        DateFormatPipe,
        TruncateTextPipe,
        TextToLinksPipe,
        FocusTrapDirective,
        StarRatingComponent,
        ObserveButtonComponent,
        HistoryEntryComponent,
        DatasetAutocompleteDirective,
        TranslateDateFormatPipe
    ],
    exports: [
        SanitizeHtmlPipe,
        StripHtmlPipe,
        FilterPipe,
        KeysPipe,
        PaginationComponent,
        DatagridComponent,
        PasswordStrengthComponent,
        NotificationsComponent,
        BreadcrumbsComponent,
        MultiselectComponent,
        SingleselectComponent,
        WriteUsInfoComponent,
        TimespanPipe,
        DateFormatPipe,
        TruncateTextPipe,
        TextToLinksPipe,
        FocusTrapDirective,
        StarRatingComponent,
        ObserveButtonComponent,
        HistoryEntryComponent,
        DatasetAutocompleteDirective,
        TranslateDateFormatPipe
    ]
})
export class SharedModule {
}
