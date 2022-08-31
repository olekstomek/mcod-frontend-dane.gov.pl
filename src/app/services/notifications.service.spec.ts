import { TestBed } from '@angular/core/testing';

import { NotificationsService } from './notifications.service';
import { TranslateService } from '@ngx-translate/core';

describe('NotificationsService', () => {
  let service: NotificationsService;
  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [NotificationsService, { provide: TranslateService, useValue: TranslateService }],
    });
    service = TestBed.inject(NotificationsService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call addSuccess function', () => {
    const spyFunction = spyOn(service, 'addSuccess');
    service.addSuccess('success');

    expect(spyFunction).toBeCalled();
  });

  it('should call addAlertWithTranslation function', () => {
    const spyFunction = spyOn(service, 'addAlertWithTranslation');
    service.addAlertWithTranslation('type', 'key');

    expect(spyFunction).toBeCalled();
  });

  it('should call addError function', () => {
    const spyFunction = spyOn(service, 'addError');
    service.addError('error');

    expect(spyFunction).toBeCalled();
  });

  it('should call addAlert function', () => {
    const spyFunction = spyOn(service, 'addAlert');
    service.addAlert('alert', 'test');

    expect(spyFunction).toBeCalled();
  });

  it('should call clearAlerts function', () => {
    const spyFunction = spyOn(service, 'clearAlerts');
    service.clearAlerts();

    expect(spyFunction).toBeCalled();
  });

  it('should call getAlerts function', () => {
    const spyFunction = spyOn(service, 'getAlerts');
    service.getAlerts();

    expect(spyFunction).toBeCalled();
  });

  it('getAlerts - Observable should add value', async () => {
    service.getAlerts().subscribe(value => {
      expect(value.length).toBeGreaterThan(0);
    });
  });

  it('should call shortcut for new success message', () => {
    const spyFunction = spyOn(service, 'addAlert');
    service.addSuccess('test');
    expect(spyFunction).toBeCalled();
  });
});
