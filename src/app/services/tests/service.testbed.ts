import { TestModuleMetadata } from '@angular/core/testing';
import { CookieService } from 'ngx-cookie-service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { RouterTestingModule } from '@angular/router/testing';
import { HttpClientModule } from '@angular/common/http';
import { NotificationsService } from '@app/services/notifications.service';
import { HttpClientTestingModule } from '@angular/common/http/testing';

export class ServiceTestbed {
    static module(forService): TestModuleMetadata {
        return {
            imports: [HttpClientTestingModule,
                RouterTestingModule,
                NgxLocalStorageModule.forRoot({prefix: 'mcod'}),
                TranslateModule.forRoot()],
            providers: [
                forService,
                HttpClientModule,
                NotificationsService,
                CookieService
            ]
        };
    }
}
