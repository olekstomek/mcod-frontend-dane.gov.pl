import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { EMPTY, of } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import { NgxLocalStorageModule } from "ngx-localstorage";
import { LocalizeRouterModule } from "@gilsdav/ngx-translate-router";
import { NoopAnimationsModule } from "@angular/platform-browser/animations";

import { NotificationsService } from "@app/services/notifications.service";
import { LoginComponent } from "@app/user/auth/login/login.component";
import { UserService } from "@app/services/user.service";
import { SeoService } from "@app/services/seo.service";
import { NotificationsFrontComponent } from "@app/shared/notifications-front/notifications-front.component";
import { NotificationsFrontService } from "@app/services/notifications-front.service";
import { NotificationsComponent } from "@app/shared/notifications/notifications.component";
import { NotificationsServerComponent } from "@app/shared/notifications-server/notifications-server.component";

class NotificationsServiceStub {
    clearAlerts() {}
    getAlerts() {
        return of([]);
    }
}
class SeoServiceStub {
    setPageTitleByTranslationKey() {}
}

class UserServiceStub {
    getCsrfToken() {
        return EMPTY;
    }
    login() {}
}

describe("LoginComponent", () => {
    let component: LoginComponent;
    let fixture: ComponentFixture<LoginComponent>;
    let service: UserService;
    const credentials = {
        email: 'user.email@example.com',
        password: 'Example.1'
    }

    beforeEach(() => {
         TestBed.configureTestingModule({
            declarations: [
                LoginComponent,
                NotificationsComponent,
                NotificationsFrontComponent,
                NotificationsServerComponent
            ],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                NgxLocalStorageModule.forRoot(),
                TranslateModule.forRoot(),
                LocalizeRouterModule.forRoot([]),
                FormsModule,
                NoopAnimationsModule
            ],
            providers: [
                {provide: UserService, useClass: UserServiceStub},
                {provide: SeoService, useClass: SeoServiceStub},
                NotificationsFrontService,
                {provide: NotificationsService, useClass: NotificationsServiceStub}
            ]
        });
        
        service = TestBed.inject(UserService);
        fixture = TestBed.createComponent(LoginComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it("should create", () => {
        expect(component).toBeTruthy();
    }); 
    
    it("should be invalid before email and password is provided", () => {
        fixture.detectChanges();

        let emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
        let passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');
        let submitBtn: HTMLButtonElement = fixture.nativeElement.querySelector('.btn');

        expect(emailInput).toBeTruthy();
        expect(passwordInput).toBeTruthy();
        expect(submitBtn.classList.contains('btn-primary')).toBeFalsy();
    });     
    
    it("should display required error messages when fields touched and left empty", () => {
        fixture.detectChanges();

        let emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
        let passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');
        let emailError: HTMLSpanElement;
        let passwordError: HTMLSpanElement;
        let submitBtn: HTMLButtonElement;

        emailInput.value = '';
        emailInput.dispatchEvent(new Event('input'));
        emailInput.dispatchEvent(new Event('blur')); // field have been touched
        passwordInput.value = '';
        passwordInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('blur'));
        fixture.detectChanges();
    
        emailError = fixture.nativeElement.querySelector('#email_error');
        passwordError = fixture.nativeElement.querySelector('#password_error');
        submitBtn = fixture.nativeElement.querySelector('.btn');
        console.log(emailError.textContent, passwordError.textContent)
        
        expect(emailError.textContent).toBeTruthy();
        expect(passwordError.textContent).toBeTruthy();
        expect(submitBtn.classList.contains('btn-primary')).toBeFalsy();
    });
    
    it("should be valid after email and password is provided", () => {
        fixture.detectChanges();

        let emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
        let passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');
        let submitBtn: HTMLButtonElement;

        emailInput.value = credentials.email;
        passwordInput.value = credentials.password;
        emailInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        
        submitBtn = fixture.nativeElement.querySelector('.btn');
        expect(submitBtn.classList.contains('btn-primary')).toBeTruthy();
    });
        
    it("should not log in user (call the service) on submit when no credentials provided", () => {
        fixture.detectChanges();

        let spy = spyOn(service, 'login').and.callFake(() => of(true))
        let emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
        let passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');
        let submitBtn: HTMLButtonElement;

        emailInput.value = '';
        passwordInput.value = '';
        emailInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));
        fixture.detectChanges();
        
        submitBtn = fixture.nativeElement.querySelector('.btn');
        submitBtn.click();
        expect(spy).not.toHaveBeenCalled();
    });

    it("should log in user (call the service) on submit", () => {
        fixture.detectChanges();

        let spy = spyOn(service, 'login').and.callFake(() => of(true))
        let emailInput: HTMLInputElement = fixture.nativeElement.querySelector('#email');
        let passwordInput: HTMLInputElement = fixture.nativeElement.querySelector('#password');
        let rememberCheck: HTMLInputElement = fixture.nativeElement.querySelector('#rememberCheck');
        let submitBtn: HTMLButtonElement;

        emailInput.value = credentials.email;
        passwordInput.value = credentials.password;
        rememberCheck.checked = false;
        
        emailInput.dispatchEvent(new Event('input'));
        passwordInput.dispatchEvent(new Event('input'));
        rememberCheck.dispatchEvent(new Event('change'));
        fixture.detectChanges();
        
        submitBtn = fixture.nativeElement.querySelector('.btn');
        submitBtn.click();
        expect(spy).toHaveBeenCalledWith(credentials.email, credentials.password, false);
    });    
});