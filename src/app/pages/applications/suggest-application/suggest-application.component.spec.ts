import { HttpClientTestingModule } from "@angular/common/http/testing";
import { ComponentFixture, TestBed } from "@angular/core/testing";
import { ReactiveFormsModule } from "@angular/forms";
import { RouterTestingModule } from "@angular/router/testing";
import { By } from "@angular/platform-browser";
import { EMPTY, of } from "rxjs";
import { TranslateModule } from "@ngx-translate/core";
import { NgxLocalStorageModule } from "ngx-localstorage";

import { ApplicationsService } from '@app/services/applications.service';
import { MathCaptchaComponent } from "@app/shared/math-captcha/math-captcha.component";
import { SeoService } from "@app/services/seo.service";
import { NotificationsService } from "@app/services/notifications.service";
import { NotificationsServerComponent } from "@app/shared/notifications-server/notifications-server.component";
import { NotificationsComponent } from "@app/shared/notifications/notifications.component";
import { SuggestApplicationComponent } from "./suggest-application.component";
import { SanitizeHtmlPipe } from "@app/shared/pipes/sanitize-html.pipe";
import { TextToLinksPipe } from "@app/shared/pipes/text-to-links.pipe";
import { ImageUploadComponent } from "../image-upload/image-upload.component";

class SeoServiceStub {
    setPageTitleByTranslationKey() {}
}

const requiredFieldsDataWithoutCaptcha = {
    'title': 'Lorem ipsum dolor sit amet as title',
    'url': 'http://example.com',
    'notes': 'Lorem ipsum dolor sit amet as notes',
    'author': 'Author Name',
    'applicant_email': 'author@example.com',
    'is_personal_data_processing_accepted': true,
    'is_terms_of_service_accepted': true,
};

describe("SuggestApplicationComponent", () => {
    let component: SuggestApplicationComponent;
    let fixture: ComponentFixture<SuggestApplicationComponent>;
    let service: ApplicationsService;

    beforeEach(() => {
         TestBed.configureTestingModule({
            declarations: [
                SuggestApplicationComponent, 
                MathCaptchaComponent,
                NotificationsComponent,
                NotificationsServerComponent,
                SanitizeHtmlPipe,
                TextToLinksPipe,
                ImageUploadComponent
            ],
            imports: [
                HttpClientTestingModule,
                RouterTestingModule,
                NgxLocalStorageModule.forRoot(),
                TranslateModule.forRoot(),
                ReactiveFormsModule
            ],
            providers: [
                ApplicationsService,
                {provide: SeoService, useClass: SeoServiceStub},
                NotificationsService
            ]
        });
        
        service = TestBed.inject(ApplicationsService);
        fixture = TestBed.createComponent(SuggestApplicationComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });
    
    it("should create", () => {
        expect(component).toBeTruthy();
    });

    it("should create a form with 8 required controls", () => {
        expect(component.applicationForm.get('title').setValue('')).toBeFalsy();
        expect(component.applicationForm.get('url').setValue('')).toBeFalsy();
        expect(component.applicationForm.get('notes').setValue('')).toBeFalsy();
        expect(component.applicationForm.get('author').setValue('')).toBeFalsy();
        expect(component.applicationForm.get('applicant_email').setValue('')).toBeFalsy();
        expect(component.applicationForm.get('is_personal_data_processing_accepted').setValue(false)).toBeFalsy();
        expect(component.applicationForm.get('is_terms_of_service_accepted').setValue(false)).toBeFalsy();
        expect(component.applicationForm.get('captcha').setValue('')).toBeFalsy();
    });

    it("should NOT submit (not call the service) when the form is invalid", () => {
        let spy = spyOn(service, 'suggest').and.callFake(() => EMPTY);
        component.onApplicationFormSubmit();
        expect(spy).not.toHaveBeenCalled();
        expect(component.isSuggestionSent).toBeFalsy();
    });
    
    describe("Submit form (save suggestion)", () => {
        let equationSum: number;

        beforeEach(() => {
            let captchaDe = fixture.debugElement.query(By.css('.captcha'));
            let equation = (captchaDe.nativeElement as HTMLDivElement).querySelector('.captcha__equation').textContent;
            let equationArr = equation.replace(/ /g, '').replace('=', '').split('+');
            equationSum = equationArr.map(item => +item).reduce((acc, item) => acc+item);
        });
        
        it("should fill required fields and the form should be valid", () => {
            component.applicationForm.patchValue({
                ...requiredFieldsDataWithoutCaptcha,
                'captcha': equationSum
            });
            expect(component.applicationForm.valid).toBeTruthy();
        }); 
        
        it("should save suggestion (call the service) when the form is valid", () => {
            let spy = spyOn(service, 'suggest').and.callFake(() => of(true));
            
            component.applicationForm.patchValue({
                ...requiredFieldsDataWithoutCaptcha,
                'captcha': equationSum
            });
               
            component.onApplicationFormSubmit();
            expect(spy).toHaveBeenCalled();
            expect(component.isSuggestionSent).toBeTruthy();
        });         
    });   
});