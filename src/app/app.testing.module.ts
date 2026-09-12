import { CommonModule } from '@angular/common';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { NgModule } from '@angular/core';
import { provideRouter } from '@angular/router';
import { BsModalService } from 'ngx-bootstrap/modal';
import { provideNgxLocalstorage } from 'ngx-localstorage';

import { FooterLogosFilterService } from '@app/layout/footer/footer-logos-filter.service';
import { NotificationsService } from '@app/services/notifications.service';
import { ApplicationsService } from '@app/services/applications.service';

@NgModule({
  declarations: [],
  imports: [CommonModule],
  providers: [
    BsModalService,
    NotificationsService,
    ApplicationsService,
    FooterLogosFilterService,
    provideHttpClient(),
    provideHttpClientTesting(),
    provideRouter([]),
    provideNgxLocalstorage({ prefix: 'mcod' }),
  ],
})
export class AppTestingModule {}
