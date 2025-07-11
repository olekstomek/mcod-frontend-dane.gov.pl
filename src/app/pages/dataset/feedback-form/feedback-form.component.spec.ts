import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { RouterTestingModule } from '@angular/router/testing';
import { By } from '@angular/platform-browser';
import { EMPTY, of } from 'rxjs';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';

import { DatasetService } from '@app/services/dataset.service';
import { NotificationsService } from '@app/services/notifications.service';
import { MathCaptchaComponent } from '@app/shared/math-captcha/math-captcha.component';
import { FeedbackFormComponent } from '@app/pages/dataset/feedback-form/feedback-form.component';
import { ApiModel } from '@app/services/api/api-model';

describe('FeedbackFormComponent', () => {
  let component: FeedbackFormComponent;
  let fixture: ComponentFixture<FeedbackFormComponent>;
  let service: DatasetService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FeedbackFormComponent, MathCaptchaComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxLocalStorageModule.forRoot(),
        TranslateModule.forRoot(),
        ReactiveFormsModule,
      ],
      providers: [{ provide: DatasetService, useClass: DatasetService }, NotificationsService],
    });

    service = TestBed.inject(DatasetService);
    fixture = TestBed.createComponent(FeedbackFormComponent);
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
    let spy = spyOn(service, 'sendDatasetFeedback').and.callFake(() => EMPTY);
    component.onFormSubmit();
    expect(spy).not.toHaveBeenCalled();
    expect(component.isFeedbackSent).toBeFalsy();
  });

  describe('submit form (save feedback)', () => {
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

    it('should save dataset feedback (call the service) when the form is valid', () => {
      let spy = spyOn(service, 'sendDatasetFeedback').and.callFake(() => of(true));

      component.feedbackForm.setValue({
        feedback: 'Lorem ipsum dolor sit amet as feedback - dataset',
        captcha: equationSum,
      });

      component.onFormSubmit();
      expect(spy).toHaveBeenCalled();
      expect(component.isFeedbackSent).toBeTruthy();
    });

    it('should save resource feedback (call the service) when the form is valid', () => {
      let spy = spyOn(service, 'sendResourceFeedback').and.callFake(() => of(true));

      component.model = ApiModel.RESOURCE;
      component.feedbackForm.setValue({
        feedback: 'Lorem ipsum dolor sit amet as feedback',
        captcha: equationSum,
      });

      component.onFormSubmit();
      expect(spy).toHaveBeenCalled();
      expect(component.isFeedbackSent).toBeTruthy();
    });
  });
});
