import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

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
        TranslateModule.forChild({parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }}),
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    providers: [BreadcrumbsInstitutionResolver],
    declarations: [InstitutionComponent, InstitutionItemComponent]
})
export class InstitutionsModule {}
