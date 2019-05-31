import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { TranslateLoader, TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { HttpClient } from '@angular/common/http';

import { SharedModule } from '@app/shared/shared.module';
import { HttpLoaderFactory } from '@app/app.module';

import { EmbeddedRoutingModule } from './embedded-routing.module';
import { EmbeddedComponent } from './embedded.component';

@NgModule({
    imports: [
        CommonModule,
        TranslateModule.forChild({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }}),
        EmbeddedRoutingModule,
        SharedModule,
    ],
    declarations: [EmbeddedComponent],
    exports: [EmbeddedComponent]
})
export class EmbeddedModule {
}
