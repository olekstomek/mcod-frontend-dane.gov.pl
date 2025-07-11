import { HTTP_INTERCEPTORS } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { TransferState } from '@angular/platform-browser';
import { ServerModule, ServerTransferStateModule } from '@angular/platform-server';

import { AbsoluteUrlInterceptor } from '@app/ssr/absolute-url-interceptor.service';
import { ResponseService } from '@app/ssr/response.service';
import { ServerCookieService } from '@app/ssr/server-cookie.service';
import { ServerStorageService } from '@app/ssr/server-storage.service';
import { TranslateUniversalLoader } from '@app/ssr/translate-universal-loader.service';
import { TranslateLoader, TranslateModule, TranslateParser } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'ngx-localstorage';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { AppComponent } from './app.component';
import { AppModule } from './app.module';

export function translateServerLoaderFactory(transferState: TransferState) {
    return new TranslateUniversalLoader(transferState);
}

@NgModule({
    imports: [
        AppModule,
        ServerModule,
        ServerTransferStateModule,
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: translateServerLoaderFactory,
                deps: [TransferState]
            },
            parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }
        }),
    ],
    providers: [
        {provide: LocalStorageService, useClass: ServerStorageService},
        {provide: CookieService, useClass: ServerCookieService},
        ResponseService,
        {
            provide: HTTP_INTERCEPTORS,
            useClass: AbsoluteUrlInterceptor,
            multi: true
        }],
    bootstrap: [AppComponent],
})
export class AppServerModule {

}
