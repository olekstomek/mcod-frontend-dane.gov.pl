import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { EMPTY, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { ActivatedRoute, Data } from '@angular/router';

import { DatasetService } from '@app/services/dataset.service';
import { MathCaptchaComponent } from '@app/shared/math-captcha/math-captcha.component';
import { SubmissionItemComponent } from '@app/pages/dataset/submission-item/submission-item.component';
import { SeoService } from '@app/services/seo.service';
import { NotificationsService } from '@app/services/notifications.service';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { NotificationsComponent } from '@app/shared/notifications/notifications.component';

class ActivatedRouteSnapshotStub {
  data: Data;
}

class ActivatedRouteStub {
  snapshot: ActivatedRouteSnapshotStub = {
    data: {
      post: {
        data: {
          attributes: {
            title: 'Lorem ipsum title',
            notes: 'Lorem ipsum notes',
          },
        },
      },
    },
  };
}

class SeoServiceStub {
  setPageTitle() {}
  setDescriptionFromText() {}
}

describe('SubmissionItemComponent', () => {
  let component: SubmissionItemComponent;
  let fixture: ComponentFixture<SubmissionItemComponent>;
  let service: DatasetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SubmissionItemComponent, MathCaptchaComponent, NotificationsComponent, NotificationsServerComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxLocalStorageModule.forRoot(),
        TranslateModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [
        DatasetService,
        { provide: ActivatedRoute, useClass: ActivatedRouteStub },
        { provide: SeoService, useClass: SeoServiceStub },
        NotificationsService,
      ],
    });

    service = TestBed.inject(DatasetService);
    fixture = TestBed.createComponent(SubmissionItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should create a form with 2 controls', () => {
    expect(component.feedbackForm.contains('feedback')).toBeTruthy();
    expect(component.feedbackForm.contains('captcha')).toBeTruthy();
  });

  it('should make the feedback control required and have at least min length', () => {
    let control = component.feedbackForm.get('feedback');
    control.patchValue('ab');
    expect(control.valid).toBeFalsy();
    expect(control.value.length).toBeLessThan(component.minFeedbackLength);
  });

  it('should make the captcha control required', () => {
    let control = component.feedbackForm.get('captcha');
    control.setValue('');
    expect(control.valid).toBeFalsy();
  });

  it('should NOT submit (not call the service) when the form is invalid', () => {
    let spy = spyOn(service, 'sendSubmissionFeedback').and.callFake(() => EMPTY);
    component.onFormSubmit();
    expect(spy).not.toHaveBeenCalled();
    expect(component.isFeedbackSent).toBeFalsy();
  });

  describe('submit form (save submission)', () => {
    let equationSum: number;

    beforeEach(() => {
      let captchaDe = fixture.debugElement.query(By.css('.captcha'));
      let equation = (captchaDe.nativeElement as HTMLDivElement).querySelector('.captcha__equation').textContent;
      let equationArr = equation.replace(/ /g, '').replace('=', '').split('+');
      equationSum = equationArr.map(item => +item).reduce((acc, item) => acc + item);
    });

    it('should fill required fields and the form should be valid', () => {
      component.feedbackForm.setValue({
        feedback: 'Lorem ipsum dolor sit amet as feedback',
        captcha: equationSum,
      });
      expect(component.feedbackForm.valid).toBeTruthy();
    });

    it('should save submission (call the service) when the form is valid', () => {
      let spy = spyOn(service, 'sendSubmissionFeedback').and.callFake(() => of(true));

      component.feedbackForm.setValue({
        feedback: 'Lorem ipsum dolor sit amet as submission',
        captcha: equationSum,
      });

      component.onFormSubmit();
      expect(spy).toHaveBeenCalled();
      expect(component.isFeedbackSent).toBeTruthy();
    });
  });
});
