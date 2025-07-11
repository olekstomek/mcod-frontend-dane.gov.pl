import { HttpClientTestingModule } from '@angular/common/http/testing';
import { async, ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';

import { NotificationsService } from '@app/services/notifications.service';
import { LostPasswordComponent } from '@app/user/auth/lost-password/lost-password.component';
import { UserService } from '@app/services/user.service';
import { SeoService } from '@app/services/seo.service';
import { NotificationsFrontComponent } from '@app/shared/notifications-front/notifications-front.component';
import { NotificationsFrontService } from '@app/services/notifications-front.service';
import { NotificationsComponent } from '@app/shared/notifications/notifications.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { of } from 'rxjs';

class SeoServiceStub {
  setPageTitleByTranslationKey() {}
}

class UserServiceStub {
  forgotPass() {}
}

describe('LostPasswordComponent', () => {
  let component: LostPasswordComponent;
  let fixture: ComponentFixture<LostPasswordComponent>;
  let service: UserService;
  const userEmail = 'user.email@example.com';

  beforeEach(async(() => {
    TestBed.configureTestingModule({
      declarations: [LostPasswordComponent, NotificationsComponent, NotificationsFrontComponent, NotificationsServerComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot(), FormsModule, NoopAnimationsModule],
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: SeoService, useClass: SeoServiceStub },
        NotificationsFrontService,
        NotificationsService,
      ],
    }).compileComponents();
  }));

  beforeEach(() => {
    service = TestBed.inject(UserService);
    fixture = TestBed.createComponent(LostPasswordComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should display email error when form touched and left empty', () => {
    let emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    let submitBtn: HTMLButtonElement;

    emailInput.value = '';
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur')); // field have been touched
    fixture.detectChanges();

    let emailError: HTMLSpanElement = fixture.nativeElement.querySelector('#email_error');
    submitBtn = fixture.nativeElement.querySelector('.btn');

    expect(emailError).toBeTruthy();
    expect(submitBtn.classList.contains('btn-primary')).toBeFalsy();
  });

  it('should be valid when email is provided', () => {
    let emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    let submitBtn: HTMLButtonElement;

    emailInput.value = userEmail;
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    submitBtn = fixture.nativeElement.querySelector('.btn');
    expect(submitBtn.classList.contains('btn-primary')).toBeTruthy();
  });

  it('should change password (call the service) on submit', () => {
    let spy = spyOn(service, 'forgotPass').and.callFake(() => of(true));
    let emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
    let submitBtn: HTMLButtonElement;

    emailInput.value = userEmail;
    emailInput.dispatchEvent(new Event('input'));
    emailInput.dispatchEvent(new Event('blur'));
    fixture.detectChanges();

    submitBtn = fixture.nativeElement.querySelector('.btn');
    submitBtn.click();

    expect(spy).toHaveBeenCalled();
    expect(component.mailSent).toBeTruthy();
  });
});
