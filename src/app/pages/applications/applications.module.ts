import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { SharedModule } from '@app/shared/shared.module';
import { AppBootstrapModule } from '@app/app-bootstrap/app-bootstrap.module';
import { BreadcrumbsAppsResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-apps.resolver';

import { ApplicationsRoutingModule } from './applications-routing.module';
import { ApplicationComponent } from './application/application.component';
import { ApplicationItemComponent } from './application-item/application-item.component';
import { SuggestApplicationComponent } from './suggest-application/suggest-application.component';

@NgModule({
    imports: [
        CommonModule,
        ApplicationsRoutingModule,
        AppBootstrapModule,
        TranslateModule.forChild({parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }}),
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    providers: [BreadcrumbsAppsResolver],
    declarations: [ApplicationComponent, ApplicationItemComponent, SuggestApplicationComponent]
})
export class ApplicationsModule {}
