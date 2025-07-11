import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
import { ServiceWorkerModule } from '@angular/service-worker';
import { environment } from '@env/environment';
import { ShepherdModule } from '@janekkruczkowski/angular-shepherd';
import { TranslateLoader, TranslateModule, TranslateParser } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { AppComponent } from './app.component';
import { AppModule, HttpLoaderFactory } from './app.module';

import { LeafletService } from '@app/services/leflet.service';
import { TourDataService } from '@app/shared/tour/tour-data.service';
import { TourService } from '@app/shared/tour/tour.service';

@NgModule({
    imports: [
        AppModule,
        BrowserTransferStateModule,
        ServiceWorkerModule.register('ngsw-worker.js', {enabled: environment.PWA}),
        ShepherdModule.forRoot(),
        NgxLocalStorageModule.forRoot({prefix: 'mcod'}),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient, TransferState]
            },
            parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }
        }),
    ],
    providers: [
        LeafletService,
        TourService,
        TourDataService,
    ],
    bootstrap: [AppComponent],
})
export class AppBrowserModule {}

