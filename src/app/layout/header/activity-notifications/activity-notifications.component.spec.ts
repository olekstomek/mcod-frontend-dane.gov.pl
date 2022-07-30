import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ObserveService } from '@app/services/observe.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { Subject } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';
import { ActivityNotificationsComponent } from './activity-notifications.component';

describe('ActivityNotificationsComponent', () => {
  let component: ActivityNotificationsComponent;
  let fixture: ComponentFixture<ActivityNotificationsComponent>;
  const original = window.location;
  const observeServiceStub = {
    notificationsChanged: new Subject<void>(),
    getNewNotifications() {
      return of({});
    },
    markAllAsRead() {
      return of({});
    },
  };
  const reloadFn = () => {
    window.location.reload(true);
  };

  beforeAll(() => {
    Object.defineProperty(window, 'location', {
      configurable: true,
      value: { reload: jest.fn() },
    });
  });

  afterAll(() => {
    Object.defineProperty(window, 'location', { configurable: true, value: original });
  });

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActivityNotificationsComponent],
      imports: [RouterTestingModule, NgxLocalStorageModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: ObserveService, useValue: observeServiceStub }],
    }).compileComponents();

    fixture = TestBed.createComponent(ActivityNotificationsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    spyOn(observeServiceStub, 'notificationsChanged').and.returnValue(true);
    spyOn(observeServiceStub, 'getNewNotifications').and.returnValue(of({}));
    expect(component).toBeDefined();
  });

  it('should call clickOutside function', () => {
    const event = { target: HTMLElement };
    component.clickOutside(event);
    expect(component.isPopupVisible).toBe(false);
  });

  it('should call countTotal function and check total count', () => {
    const sum = component.datasetsCount + component.searchResultsCount;
    component.countTotal();
    expect(component.totalCount).toEqual(sum);
  });

  it('should call onMarkAllAsRead function and reload', () => {
    spyOn(observeServiceStub, 'markAllAsRead').and.returnValue(of({}));
    component.onMarkAllAsRead();
    reloadFn();
    expect(window.location.reload).toHaveBeenCalled();
  });

  it('should call onPopupTriggerKeyDown function with key Tab', () => {
    const event = new KeyboardEvent('keydown', { key: 'Tab' });
    document.dispatchEvent(event);
    component.onPopupTriggerKeyDown(event);
    expect(event.key).toBe('Tab');
  });

  it('should call onPopupTriggerKeyDown function with key Space', () => {
    const event = new KeyboardEvent('keydown', { key: 'Space' });
    document.dispatchEvent(event);
    component.onPopupTriggerKeyDown(event);
    expect(event.key).toBe('Space');
  });

  it('should call onPopupTriggerKeyDown function with key Tab and set isPopupVisible for false', () => {
    const event = new KeyboardEvent('keydown', { key: 'Tab', shiftKey: true });
    document.dispatchEvent(event);
    component.onPopupTriggerKeyDown(event);
    expect(component.isPopupVisible).toBe(false);
  });

  it('should call onPopupTriggerKeyDown function with key Space and set isPopupVisible for false', () => {
    const event = new KeyboardEvent('keydown', { key: 'Space', shiftKey: true });
    const spyFunction = spyOn(event, 'preventDefault');
    document.dispatchEvent(event);
    component.onPopupTriggerKeyDown(event);
    expect(component.isPopupVisible).toBe(false);
    expect(spyFunction).toHaveBeenCalled();
  });

  it('should call onPopupBlur function and check if button is focus', () => {
    const div = fixture.debugElement.query(By.css('.activity-notifications')).nativeElement;
    const button = div.querySelector('button');
    component.onPopupBlur();
    button.focus();
    expect(button).toBe(document.activeElement);
  });
});
