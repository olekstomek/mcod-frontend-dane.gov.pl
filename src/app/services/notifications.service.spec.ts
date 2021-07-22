import { TestBed, inject } from '@angular/core/testing';

import { NotificationsService } from './notifications.service';
import {TranslateService} from '@ngx-translate/core';

describe('NotificationsService', () => {
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationsService,
          {provide: TranslateService, useValue: TranslateService}
          ]
    });
  });

  it('should be created', inject([NotificationsService], (service: NotificationsService) => {
    expect(service).toBeTruthy();
  }));
});
