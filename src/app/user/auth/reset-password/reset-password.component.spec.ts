import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { FormBuilder, FormsModule, ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { LocalizeRouterModule } from "@gilsdav/ngx-translate-router";
import { TranslateModule } from "@ngx-translate/core";
import { NgxLocalStorageModule } from "ngx-localstorage";
import { EMPTY } from "rxjs";

import { NotificationsFrontService } from "@app/services/notifications-front.service";
import { NotificationsService } from "@app/services/notifications.service";
import { SeoService } from "@app/services/seo.service";
import { UserService } from "@app/services/user.service";
import { NotificationsFrontComponent } from "@app/shared/notifications-front/notifications-front.component";
import { NotificationsServerComponent } from "@app/shared/notifications-server/notifications-server.component";
import { NotificationsComponent } from "@app/shared/notifications/notifications.component";
import { ResetPasswordComponent } from "@app/user/auth/reset-password/reset-password.component";
import { BsModalService } from "ngx-bootstrap";

class BsModalServiceStub {}

class SeoServiceStub {
    setPageTitleByTranslationKey() {}
}

class UserServiceStub {
    passwordCustomValidators: string[] = [];
    resetPass() {}
}

describe("ResetPasswordComponent", () => {
    let component: ResetPasswordComponent;
    let fixture: ComponentFixture<ResetPasswordComponent>;
    let service: UserService;

    beforeEach(() => {
         TestBed.configureTestingModule({
            declarations: [
                ResetPasswordComponent,
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
                ReactiveFormsModule
            ],
            providers: [
                {provide: UserService, useClass: UserServiceStub},
                {provide: SeoService, useClass: SeoServiceStub},
                {provide: FormBuilder, useClass: FormBuilder},
                NotificationsFrontService,
                NotificationsService
            ]
        });
    });
    
    beforeEach(() => {
        service = TestBed.inject(UserService);
        fixture = TestBed.createComponent(ResetPasswordComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });    
    
    it("should create", () => {
        expect(component).toBeDefined();
    });     
    
    it("should create a form with 2 controls and all should be required", () => {
        expect(component.resetPasswordForm.get('new_password1').setValue('')).toBeFalsy();
        expect(component.resetPasswordForm.get('new_password2').setValue('')).toBeFalsy();
    });
    
    it("should NOT submit (not call the service) when the form is invalid", () => {
        let spy = spyOn(service, 'resetPass').and.callFake(() => EMPTY);
        component.onSubmitNewPassword();
        expect(spy).not.toHaveBeenCalled();
        expect(component.passwordChanged).toBeFalsy();
    });
   
    it.skip("should fill required fields and the form should be valid", () => {
        component.resetPasswordForm.setValue({
            'new_password1': 'Example.1',
            'new_password2': 'Example.2',
        });
        expect(component.resetPasswordForm.valid).toBeTruthy();
    });
});