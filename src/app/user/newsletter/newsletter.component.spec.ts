import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormBuilder, FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { NewsletterService } from '@app/services/newsletter.service';
import { NewsletterComponent } from '@app/user/newsletter/newsletter.component';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';

class SeoServiceStub {
  setPageTitleByTranslationKey() {}
}

describe('NewsletterComponent', () => {
  let component: NewsletterComponent;
  let fixture: ComponentFixture<NewsletterComponent>;
  let service: NewsletterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [NewsletterComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxLocalStorageModule.forRoot(),
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
        FormsModule,
        ReactiveFormsModule,
        NoopAnimationsModule,
      ],
      providers: [{ provide: SeoService, useClass: SeoServiceStub }, FormBuilder, NotificationsService, NewsletterService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(NewsletterService);
    fixture = TestBed.createComponent(NewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should create a form with 3 controls and all should be required', () => {
    component.ngOnInit();
    expect(component.newsletterForm.get('email').setValue('')).toBeFalsy();
    expect(component.newsletterForm.get('personal_data_processing').setValue('')).toBeFalsy();
    expect(component.newsletterForm.get('personal_data_use').setValue('')).toBeFalsy();
  });

  it('should determines whether all consents are checked or unchecked', () => {
    component.onChangeAll(true);
    expect(component.allChecked).toEqual(true);
  });

  it('should determines whether single consent is checked or unchecked', () => {
    component.onChange('personal_data_use', false);
    expect(component.allChecked).toEqual(false);
  });

  it('should fill required fields and the form should be valid', () => {
    component.newsletterForm.setValue({
      email: 'user@example.com',
      personal_data_processing: true,
      personal_data_use: true,
    });
    component.newsletterForm.updateValueAndValidity();
    fixture.detectChanges();
    component.onSubmit();
    expect(component.newsletterForm.valid).toBeTruthy();
  });
});
