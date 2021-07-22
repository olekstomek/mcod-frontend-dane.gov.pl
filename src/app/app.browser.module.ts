import { HttpClient } from '@angular/common/http';
import { ErrorHandler, Inject, NgModule } from '@angular/core';
import { BrowserTransferStateModule, TransferState } from '@angular/platform-browser';
import { Router } from '@angular/router';
import { ServiceWorkerModule } from '@angular/service-worker';
import { ApmErrorHandler, ApmService } from '@elastic/apm-rum-angular';
import { environment } from '@env/environment';
import { ShepherdModule } from '@janekkruczkowski/angular-shepherd';
import { TranslateLoader, TranslateModule, TranslateParser } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { AppComponent } from './app.component';
import { AppModule, HttpLoaderFactory } from './app.module';

import { APP_CONFIG } from '@app/app.config';
import { ApmConfigService } from '@app/services/apm-config.service';
import { LeafletService } from '@app/services/leflet.service';
import { TourDataService } from '@app/shared/tour/tour-data.service';
import { TourService } from '@app/shared/tour/tour.service';

function errorHandlerFactory(apmConfig: ApmConfigService): ErrorHandler {
    return apmConfig.isApmErrorHandlerEnabled() ? new ApmErrorHandler() : new ErrorHandler();
}

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
        ApmConfigService,
        TourService,
        TourDataService,
        {
            provide: ApmService,
            useClass: ApmService,
            deps: [Router]
        },
        {
            provide: ErrorHandler,
            useFactory: errorHandlerFactory,
            deps: [ApmConfigService]
        }
    ],
    bootstrap: [AppComponent],
})
export class AppBrowserModule {
    constructor(private readonly apmConfig: ApmConfigService,
                @Inject(ApmService) private readonly service: ApmService) {
        const serviceName = this.apmConfig.getServiceName();
        if (!serviceName) {
            return;
        }
        service.init({
            serviceName: serviceName,
            serverUrl: APP_CONFIG.urls.apm
        });
    }
}
