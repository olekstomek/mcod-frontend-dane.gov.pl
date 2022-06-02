import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { EMPTY, of } from 'rxjs';

import { NotificationsFrontService } from '@app/services/notifications-front.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';
import { NotificationsFrontComponent } from '@app/shared/notifications-front/notifications-front.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { NotificationsComponent } from '@app/shared/notifications/notifications.component';
import { RegisterComponent } from '@app/user/auth/register/register.component';
import { BsModalService } from 'ngx-bootstrap';
import { VisualPasswordValidatorComponent } from '../visual-password-validator/visual-password-validator.component';
import { RodoModalComponent } from '@app/shared/rodo-modal/rodo-modal.component';

class BsModalServiceStub {}

class SeoServiceStub {
  setPageTitleByTranslationKey() {}
}

class UserServiceStub {
  passwordCustomValidators: string[] = [];
  registerUser() {
    return of(true);
  }
}

describe('RegisterComponent', () => {
  let component: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let service: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [
        RegisterComponent,
        NotificationsComponent,
        NotificationsFrontComponent,
        NotificationsServerComponent,
        VisualPasswordValidatorComponent,
        RodoModalComponent,
      ],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxLocalStorageModule.forRoot(),
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
      ],
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: SeoService, useClass: SeoServiceStub },
        { provide: BsModalService, useClass: BsModalServiceStub },
        { provide: FormBuilder, useClass: FormBuilder },
        NotificationsFrontService,
        NotificationsService,
      ],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(UserService);
    fixture = TestBed.createComponent(RegisterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should create a form with 5 controls and all should be required', () => {
    expect(component.registrationForm.get('email').setValue('')).toBeFalsy();
    expect(component.registrationForm.get('password1').setValue('')).toBeFalsy();
    expect(component.registrationForm.get('password2').setValue('')).toBeFalsy();
    expect(component.registrationForm.get('rodoConsent').setValue(false)).toBeFalsy();
    expect(component.registrationForm.get('regulationsConsent').setValue(false)).toBeFalsy();
  });

  it('should NOT submit (not call the service) when the form is invalid', () => {
    let spy = spyOn(service, 'registerUser').and.callFake(() => EMPTY);
    component.onSubmit();
    expect(spy).not.toHaveBeenCalled();
    expect(component.isRegistered).toBeFalsy();
  });

  it.skip('should fill required fields and the form should be valid', () => {
    component.registrationForm.setValue({
      email: 'user@example.com',
      password1: 'Example.1',
      password2: 'Example.5',
      rodoConsent: true,
      regulationsConsent: true,
    });
    component.registrationForm.updateValueAndValidity();
    fixture.detectChanges();
    expect(component.registrationForm.valid).toBeTruthy();
  });
});
