import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { InstitutionItemListViewFiltersComponent } from '@app/pages/institutions/institution-item-list-view-filters/institution-item-list-view-filters.component';
import { DatepickerModule } from '@app/shared/datepicker/datepicker.module';
import { BreadcrumbsInstitutionResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-institution.resolver';
import { SharedModule } from '@app/shared/shared.module';
import { AppBootstrapModule } from '@app/app-bootstrap/app-bootstrap.module';

import { InstitutionComponent } from './institution/institution.component';
import { InstitutionItemComponent } from './institution-item/institution-item.component';
import { InstitutionsRoutingModule } from './institutions-routing.module';

@NgModule({
    imports: [
        CommonModule,
        InstitutionsRoutingModule,
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
        ReactiveFormsModule    
    ],
    providers: [BreadcrumbsInstitutionResolver],
    declarations: [
        InstitutionComponent,
        InstitutionItemComponent,
        InstitutionItemListViewFiltersComponent
    ]
})
export class InstitutionsModule {}
