import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationsService } from '@app/services/notifications.service';
import { TourButtonComponent } from '@app/shared/tour/tour-button/tour-button.component';
import { TourDataService } from '@app/shared/tour/tour-data.service';
import { TourService } from '@app/shared/tour/tour.service';
import { ShepherdService } from '@janekkruczkowski/angular-shepherd';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';

describe('TourButtonComponent', () => {
  let component: TourButtonComponent;
  let fixture: ComponentFixture<TourButtonComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TourButtonComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NgxLocalStorageModule.forRoot(), TranslateModule.forRoot()],
      providers: [TourDataService, TourService, NotificationsService, ShepherdService],
    }).compileComponents();

    fixture = TestBed.createComponent(TourButtonComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should sets button visibility for current route', () => {
    component.ngOnInit();
    expect(component.isTooltipVisible).toEqual(true);
    expect(component.isButtonActive).toEqual(true);
  });

  it('should shows tour', () => {
    component.showTour();
  });
});
