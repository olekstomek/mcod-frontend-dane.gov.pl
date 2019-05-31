import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { HomeComponent } from './home.component';
import { CategoriesComponent } from './categories/categories.component';
import { NewsComponent } from './news/news.component';
import { SearchComponent } from './search/search.component';
import { InstitutionsComponent } from './institutions/institutions.component';
import { SharedModule } from '@app/shared/shared.module';
import { StatsComponent } from '@app/pages/home/stats/stats.component';
import { ServiceAlertComponent } from './service-alert/service-alert.component';

@NgModule({
    imports: [
        CommonModule,
        RouterModule,
        FormsModule,
        TranslateModule.forChild({parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }}),
        SharedModule
    ],
    declarations: [
        HomeComponent,
        StatsComponent,
        CategoriesComponent,
        InstitutionsComponent,
        NewsComponent,
        SearchComponent,
        ServiceAlertComponent
    ],
    exports: [
        HomeComponent,
        StatsComponent,
        InstitutionsComponent,
        CategoriesComponent,
        NewsComponent,
        SearchComponent
    ]
})
export class HomeModule {
}
