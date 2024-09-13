import { HttpClientTestingModule, HttpTestingController } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationsService } from '@app/services/notifications.service';
import { Tour, TourProgress } from '@app/shared/tour/Tour';
import { TourDataService } from '@app/shared/tour/tour-data.service';
import { TourService } from '@app/shared/tour/tour.service';
import { ShepherdService } from '@janekkruczkowski/angular-shepherd';
import { TranslateModule } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'ngx-localstorage';

class LocalStorageServiceStub {
  set() {}
}
class ShepherdServiceStub {
  tourObject: {} = { on: jest.fn() };
  addSteps() {}
  start() {}
}

describe('TourService', () => {
  let service: TourService;
  let httpMock: HttpTestingController;
  let serviceShepherd: ShepherdService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        TourService,
        NotificationsService,
        CookieService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
        TourDataService,
        { provide: ShepherdService, useClass: ShepherdServiceStub },
      ],
    });

    service = TestBed.inject(TourService);
    serviceShepherd = TestBed.inject(ShepherdService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should starts tour', () => {
    const tour: Tour = {
      name: 'test',
      id: '1',
      items: [],
    };
    spyOn(serviceShepherd, 'addSteps');
    spyOn(serviceShepherd, 'tourObject');
    spyOn(serviceShepherd, 'start');
    service.startTour(tour);
    expect(serviceShepherd.defaultStepOptions).toStrictEqual({});
  });

  it('should gets current tour', () => {
    service.getCurrentTour().subscribe(value => {
      expect(value).toBe({});
    });
  });

  it('should pauses tour', () => {
    const tour: Tour = {
      name: 'test',
      id: '1',
      items: [],
      progress: TourProgress.fromRaw('1', 1, '2'),
    };
    spyOn(LocalStorageService.prototype, 'set');
    service.pauseTour(tour);
    expect(tour.progress).toBeTruthy();
  });

  it('should cleanups', () => {
    service.ngOnDestroy();
  });
});
