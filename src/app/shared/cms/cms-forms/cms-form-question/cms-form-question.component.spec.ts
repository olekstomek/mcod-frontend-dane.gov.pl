import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CmsFormQuestionComponent } from '@app/shared/cms/cms-forms/cms-form-question/cms-form-question.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';

describe('CmsFormQuestionComponent', () => {
  let component: CmsFormQuestionComponent;
  let fixture: ComponentFixture<CmsFormQuestionComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CmsFormQuestionComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxLocalStorageModule.forRoot(),
        TranslateModule.forRoot(),
        NoopAnimationsModule,
        FormsModule,
        ReactiveFormsModule,
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(CmsFormQuestionComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
