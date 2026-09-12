import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { SeoService } from '@app/services/seo.service';
import { DatasetService } from '@app/services/dataset.service';
import { ApplicationsService } from '@app/services/applications.service';
import { MathCaptchaComponent } from '@app/shared/math-captcha/math-captcha.component';
import { of } from 'rxjs';
import { ContactFormComponent } from './contact-form.component';
import { ContactCategory, ContactTopic } from './contact-form-models';
import {
  PoCoToCategory,
  PoCoToLicenseType,
} from '@app/shared/forms/form-parts/po-co-to-fields-form-part/po-co-to-fields-models';

const TOPICS_WITH_CATEGORY = [
  { topic: ContactTopic.Data, name: 'Data', categoryCount: 8, category: ContactCategory.SharingData },
  { topic: ContactTopic.Portal, name: 'Portal', categoryCount: 5, category: ContactCategory.PortalFeatures },
];

const TOPICS_WITHOUT_CATEGORY = [
  { topic: ContactTopic.PersonalData, name: 'PersonalData' },
  { topic: ContactTopic.LegalRegulations, name: 'LegalRegulations' },
  { topic: ContactTopic.Other, name: 'Other' },
];

describe('ContactFormComponent', () => {
  let component: ContactFormComponent;
  let fixture: ComponentFixture<ContactFormComponent>;
  let setPageTitleByTranslationKey: jest.Mock;

  beforeEach(async () => {
    setPageTitleByTranslationKey = jest.fn();
    window.scrollTo = jest.fn();

    TestBed.overrideComponent(MathCaptchaComponent, {
      set: { template: '<input [formControl]="control" />' },
    });
    jest.spyOn(MathCaptchaComponent.prototype, 'validate').mockReturnValue(null);

    TestBed.overrideProvider(DatasetService, {
      useValue: {
        sendSubmission: jest.fn(() => of({})),
        sendDatasetFeedback: jest.fn(() => of({})),
        sendResourceFeedback: jest.fn(() => of({})),
      },
    });

    TestBed.overrideProvider(ApplicationsService, {
      useValue: { suggest: jest.fn(() => of({})) },
    });

    await TestBed.configureTestingModule({
      imports: [ContactFormComponent, TranslateModule.forRoot(), LocalizeRouterModule.forRoot([])],
      providers: [
        { provide: SeoService, useValue: { setPageTitleByTranslationKey } },
        importProvidersFrom(AppTestingModule),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactFormComponent);
    component = fixture.componentInstance;

    fixture.detectChanges();
  });

  function setTopic(topic: ContactTopic | null): void {
    component.mainForm.controls.topic.setValue(topic);
    TestBed.flushEffects();
  }

  function setCategory(category: ContactCategory | null): void {
    component.mainForm.controls.category.setValue(category);
    TestBed.flushEffects();
  }

  function setCaptcha(value: string | null = '123'): void {
    component.mainForm.controls.captcha.setValue(value);
    TestBed.flushEffects();
  }

  function fillValidForm(topic: ContactTopic, category?: ContactCategory): void {
    setTopic(topic);

    if (category) {
      setCategory(category);
    }

    setCaptcha();
  }

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should call SeoService with correct translation key on init', () => {
    expect(setPageTitleByTranslationKey).toHaveBeenCalledTimes(1);
    expect(setPageTitleByTranslationKey).toHaveBeenCalledWith(['Forms.PageHeader.Heading.Contact']);
  });

  it('should initialize with empty controls, category disabled, form invalid and isFormSent false', () => {
    expect(component.mainForm.controls.topic.value).toBeNull();
    expect(component.mainForm.controls.topic.hasError('required')).toBe(true);
    expect(component.mainForm.controls.category.value).toBeNull();
    expect(component.mainForm.controls.category.disabled).toBe(true);
    expect(component.showCategoryField()).toBe(true);
    expect(component.filteredCategoryOptions()).toEqual([]);
    expect(component.mainForm.valid).toBe(false);
    expect(component.isFormSent()).toBe(false);
  });

  it('topicOptions should expose all 5 required topic values', () => {
    const values = component.topicOptions.map((o) => o.value);
    expect(component.topicOptions.length).toBe(5);
    expect(values).toContain(ContactTopic.Data);
    expect(values).toContain(ContactTopic.Portal);
    expect(values).toContain(ContactTopic.PersonalData);
    expect(values).toContain(ContactTopic.LegalRegulations);
    expect(values).toContain(ContactTopic.Other);
  });

  describe('Category field', () => {
    it.each(TOPICS_WITH_CATEGORY)(
      'topic $name should be visible, enabled and have $categoryCount options',
      ({ topic, categoryCount }) => {
        setTopic(topic);

        expect(component.showCategoryField()).toBe(true);
        expect(component.mainForm.controls.category.disabled).toBe(false);
        expect(component.filteredCategoryOptions().length).toBe(categoryCount);
      },
    );

    it.each(TOPICS_WITHOUT_CATEGORY)('topic $name should be hidden and category control disabled', ({ topic }) => {
      setTopic(topic);

      expect(component.showCategoryField()).toBe(false);
      expect(component.mainForm.controls.category.disabled).toBe(true);
    });

    it('should reset category value when topic changes', () => {
      setTopic(ContactTopic.Data);
      component.mainForm.controls.category.setValue(ContactCategory.SharingData);

      setTopic(ContactTopic.Portal);

      expect(component.mainForm.controls.category.value).toBeNull();
    });

    it('should sync category control enabled/disabled state with topic', () => {
      setTopic(ContactTopic.Data);
      expect(component.mainForm.controls.category.disabled).toBe(false);

      setTopic(ContactTopic.PersonalData);
      expect(component.mainForm.controls.category.disabled).toBe(true);

      setTopic(ContactTopic.Portal);
      expect(component.mainForm.controls.category.disabled).toBe(false);
    });
  });

  describe('Form validation', () => {
    it('should mark category as required and form as invalid when topic with category is selected but category is empty', () => {
      setTopic(ContactTopic.Data);

      expect(component.mainForm.controls.category.hasError('required')).toBe(true);
      expect(component.mainForm.valid).toBe(false);
    });

    it.each(TOPICS_WITH_CATEGORY)(
      'should be valid when topic $name and matching category are selected',
      ({ topic, category }) => {
        fillValidForm(topic, category);

        expect(component.mainForm.valid).toBe(true);
      },
    );

    it.each(TOPICS_WITHOUT_CATEGORY)(
      'should be valid when topic $name is selected (no category required)',
      ({ topic }) => {
        fillValidForm(topic);

        expect(component.mainForm.valid).toBe(true);
      },
    );
  });

  describe('Form submission', () => {
    it('should not submit when topic is not selected', () => {
      component.onFormSubmit();

      expect(component.isFormSent()).toBe(false);
    });

    it('should not submit when topic requires category but category is empty', () => {
      setTopic(ContactTopic.Data);

      component.onFormSubmit();

      expect(component.isFormSent()).toBe(false);
    });

    it.each(TOPICS_WITH_CATEGORY)(
      'should submit when topic $name and matching category are selected',
      ({ topic, category }) => {
        fillValidForm(topic, category);

        component.onFormSubmit();

        expect(component.isFormSent()).toBe(true);
      },
    );

    it.each(TOPICS_WITHOUT_CATEGORY)(
      'should submit when topic $name is selected (no category required)',
      ({ topic }) => {
        fillValidForm(topic);

        component.onFormSubmit();

        expect(component.isFormSent()).toBe(true);
      },
    );

    describe('SuggestData category (special API flow)', () => {
      it('should NOT set isFormSent and should set isErrorOnSubmit when sub-forms are missing', () => {
        fillValidForm(ContactTopic.Data, ContactCategory.SuggestData);

        component.onFormSubmit();

        expect(component.isFormSent()).toBe(false);
        expect(component.isErrorOnSubmit()).toBe(true);
      });

      it('should set isFormSent when SuggestData is selected and all required sub-form fields are filled', () => {
        setTopic(ContactTopic.Data);
        setCategory(ContactCategory.SuggestData);
        fixture.detectChanges();

        component.mainForm.controls.suggestDatasetFields?.controls.nameOfData.setValue('Nazwa zbioru danych');
        component.mainForm.controls.suggestDatasetFields?.controls.description.setValue('Opis danych');
        setCaptcha();
        component.onFormSubmit();

        expect(component.isFormSent()).toBe(true);
      });

      it('should call DatasetService.sendSubmission with correct payload when SuggestData is submitted', () => {
        const datasetService = TestBed.inject(DatasetService);

        setTopic(ContactTopic.Data);
        setCategory(ContactCategory.SuggestData);
        fixture.detectChanges();
        component.mainForm.controls.nameEmail?.controls.name.setValue('Jan Kowalski');
        component.mainForm.controls.nameEmail?.controls.email.setValue('jan@example.com');
        component.mainForm.controls.suggestDatasetFields?.controls.nameOfData.setValue('Nazwa zbioru danych');
        component.mainForm.controls.suggestDatasetFields?.controls.description.setValue('Opis danych');
        component.mainForm.controls.suggestDatasetFields?.controls.foundLink.setValue('https://example.com');
        component.mainForm.controls.suggestDatasetFields?.controls.potentialUses.setValue('Analiza danych');
        setCaptcha();

        component.onFormSubmit();

        expect(datasetService.sendSubmission).toHaveBeenCalledTimes(1);
        expect(datasetService.sendSubmission).toHaveBeenCalledWith(
          expect.objectContaining({
            applicant_full_name: 'Jan Kowalski',
            applicant_email: 'jan@example.com',
            title: 'Nazwa zbioru danych',
            notes: 'Opis danych',
            data_link: 'https://example.com',
            potential_possibilities: 'Analiza danych',
          }),
        );
      });
    });

    describe('DataFeedback category (special API flow)', () => {
      const datasetLink = `${window.location.origin}/pl/dataset/123`;
      const resourceLink = `${window.location.origin}/pl/dataset/123/resource/456`;

      function fillFeedbackForm(link: string): void {
        setTopic(ContactTopic.Data);
        setCategory(ContactCategory.DataFeedback);
        fixture.detectChanges();
        component.mainForm.controls.feedbackFields?.controls.link.setValue(link);
        component.mainForm.controls.feedbackFields?.controls.description.setValue('Treść uwagi');
        setCaptcha();
      }

      it('should NOT set isFormSent and should set isErrorOnSubmit when sub-forms are missing', () => {
        fillValidForm(ContactTopic.Data, ContactCategory.DataFeedback);

        component.onFormSubmit();

        expect(component.isFormSent()).toBe(false);
        expect(component.isErrorOnSubmit()).toBe(true);
      });

      it('should set isFormSent when DataFeedback is selected and all required sub-form fields are filled', () => {
        fillFeedbackForm(datasetLink);

        component.onFormSubmit();

        expect(component.isFormSent()).toBe(true);
      });

      it('should call sendDatasetFeedback when link points to a dataset', () => {
        const datasetService = TestBed.inject(DatasetService);

        fillFeedbackForm(datasetLink);
        component.mainForm.controls.nameEmail?.controls.name.setValue('Jan Kowalski');
        component.mainForm.controls.nameEmail?.controls.email.setValue('jan@example.com');

        component.onFormSubmit();

        expect(datasetService.sendDatasetFeedback).toHaveBeenCalledTimes(1);
        expect(datasetService.sendDatasetFeedback).toHaveBeenCalledWith(
          '123',
          expect.objectContaining({
            comment: 'Treść uwagi',
            applicant_full_name: 'Jan Kowalski',
            applicant_email: 'jan@example.com',
          }),
        );
        expect(datasetService.sendResourceFeedback).not.toHaveBeenCalled();
      });

      it('should call sendResourceFeedback when link points to a resource', () => {
        const datasetService = TestBed.inject(DatasetService);

        fillFeedbackForm(resourceLink);

        component.onFormSubmit();

        expect(datasetService.sendResourceFeedback).toHaveBeenCalledTimes(1);
        expect(datasetService.sendResourceFeedback).toHaveBeenCalledWith(
          '456',
          expect.objectContaining({ comment: 'Treść uwagi' }),
        );
        expect(datasetService.sendDatasetFeedback).not.toHaveBeenCalled();
      });

      it('should not submit when link fails datasetOrResourceLinkValidator', () => {
        fillFeedbackForm('https://not-allowed.example.com/foo');

        component.onFormSubmit();

        expect(component.isFormSent()).toBe(false);
      });
    });

    describe('SuggestReuse category (special API flow)', () => {
      it('should NOT set isFormSent and should set isErrorOnSubmit when sub-forms are missing', () => {
        fillValidForm(ContactTopic.Data, ContactCategory.SuggestReuse);

        component.onFormSubmit();

        expect(component.isFormSent()).toBe(false);
        expect(component.isErrorOnSubmit()).toBe(true);
      });

      it('should set isFormSent when SuggestReuse is selected and all required sub-form fields are filled', async () => {
        setTopic(ContactTopic.Data);
        setCategory(ContactCategory.SuggestReuse);
        fixture.detectChanges();

        component.mainForm.controls.nameEmail?.controls.name.setValue('Jan Kowalski');
        component.mainForm.controls.nameEmail?.controls.email.setValue('jan@example.com');
        component.mainForm.controls.poCoToFields?.controls.category.setValue(PoCoToCategory.App);
        component.mainForm.controls.poCoToFields?.controls.name.setValue('Nazwa aplikacji');
        component.mainForm.controls.poCoToFields?.controls.url.setValue('https://example.com');
        component.mainForm.controls.poCoToFields?.controls.licenseType.setValue(PoCoToLicenseType.Free);
        component.mainForm.controls.poCoToFields?.controls.description.setValue('Opis aplikacji');
        component.mainForm.controls.poCoToFields?.controls.author.setValue('Jan Kowalski');
        component.mainForm.controls.poCoToFields?.controls.tosAccepted.setValue(true);
        component.mainForm.controls.poCoToFields?.controls.personalDataAccepted.setValue(true);
        setCaptcha();
        await fixture.whenStable();

        jest.useFakeTimers();
        component.onFormSubmit();
        await jest.runAllTimersAsync();
        jest.useRealTimers();

        expect(component.isFormSent()).toBe(true);
      });

      it('should call ApplicationsService.suggest with correct payload when SuggestReuse is submitted', async () => {
        const applicationsService = TestBed.inject(ApplicationsService);

        setTopic(ContactTopic.Data);
        setCategory(ContactCategory.SuggestReuse);
        fixture.detectChanges();
        component.mainForm.controls.nameEmail?.controls.name.setValue('Jan Kowalski');
        component.mainForm.controls.nameEmail?.controls.email.setValue('jan@example.com');
        component.mainForm.controls.poCoToFields?.controls.category.setValue(PoCoToCategory.App);
        component.mainForm.controls.poCoToFields?.controls.name.setValue('Nazwa aplikacji');
        component.mainForm.controls.poCoToFields?.controls.url.setValue('https://example.com');
        component.mainForm.controls.poCoToFields?.controls.licenseType.setValue(PoCoToLicenseType.Free);
        component.mainForm.controls.poCoToFields?.controls.description.setValue('Opis aplikacji');
        component.mainForm.controls.poCoToFields?.controls.author.setValue('Jan Kowalski');
        component.mainForm.controls.poCoToFields?.controls.keywords.setValue('aplikacja, test');
        component.mainForm.controls.poCoToFields?.controls.tosAccepted.setValue(true);
        component.mainForm.controls.poCoToFields?.controls.personalDataAccepted.setValue(true);
        setCaptcha();
        await fixture.whenStable();

        jest.useFakeTimers();
        component.onFormSubmit();
        await jest.runAllTimersAsync();
        jest.useRealTimers();

        expect(applicationsService.suggest).toHaveBeenCalledTimes(1);
        expect(applicationsService.suggest).toHaveBeenCalledWith(
          expect.objectContaining({
            applicant_full_name: 'Jan Kowalski',
            applicant_email: 'jan@example.com',
            title: 'Nazwa aplikacji',
            url: 'https://example.com',
            notes: 'Opis aplikacji',
            author: 'Jan Kowalski',
            category: PoCoToCategory.App,
            license_type: PoCoToLicenseType.Free,
            keywords: ['aplikacja', 'test'],
            is_terms_of_service_accepted: true,
            is_personal_data_processing_accepted: true,
          }),
        );
      });
    });
  });

  describe('Form categories', () => {
    it('should add new fields to form when category is selected', () => {
      setTopic(ContactTopic.Data);
      setCategory(ContactCategory.SuggestData);

      fixture.detectChanges();

      expect(component.mainForm.value).toHaveProperty('suggestDatasetFields');
    });

    it('should render app-suggest-dataset-form-part component when SuggestData category is selected', () => {
      setTopic(ContactTopic.Data);
      setCategory(ContactCategory.SuggestData);

      fixture.detectChanges();

      const suggestDatasetComponent = fixture.debugElement.query((el) => el.name === 'app-suggest-dataset-form-part');
      expect(suggestDatasetComponent).toBeTruthy();
    });

    it('should not render app-suggest-dataset-form-part when other category is selected', () => {
      setTopic(ContactTopic.Data);
      setCategory(ContactCategory.SharingData);

      fixture.detectChanges();

      const suggestDatasetComponent = fixture.debugElement.query((el) => el.name === 'app-suggest-dataset-form-part');
      expect(suggestDatasetComponent).toBeFalsy();
    });

    it('should add poCoToFields to form when SuggestReuse category is selected', () => {
      setTopic(ContactTopic.Data);
      setCategory(ContactCategory.SuggestReuse);

      fixture.detectChanges();

      expect(component.mainForm.value).toHaveProperty('poCoToFields');
    });

    it('should render app-po-co-to-fields-form-part component when SuggestReuse category is selected', () => {
      setTopic(ContactTopic.Data);
      setCategory(ContactCategory.SuggestReuse);

      fixture.detectChanges();

      const poCoToComponent = fixture.debugElement.query((el) => el.name === 'app-po-co-to-fields-form-part');
      expect(poCoToComponent).toBeTruthy();
    });

    it('should not render app-po-co-to-fields-form-part when other category is selected', () => {
      setTopic(ContactTopic.Data);
      setCategory(ContactCategory.SharingData);

      fixture.detectChanges();

      const poCoToComponent = fixture.debugElement.query((el) => el.name === 'app-po-co-to-fields-form-part');
      expect(poCoToComponent).toBeFalsy();
    });

    it('should add feedbackFields to form when DataFeedback category is selected', () => {
      setTopic(ContactTopic.Data);
      setCategory(ContactCategory.DataFeedback);

      fixture.detectChanges();

      expect(component.mainForm.value).toHaveProperty('feedbackFields');
    });

    it('should render app-feedback-fields-form-part component when DataFeedback category is selected', () => {
      setTopic(ContactTopic.Data);
      setCategory(ContactCategory.DataFeedback);

      fixture.detectChanges();

      const feedbackFieldsComponent = fixture.debugElement.query((el) => el.name === 'app-feedback-fields-form-part');
      expect(feedbackFieldsComponent).toBeTruthy();
    });

    it('should not render app-feedback-fields-form-part when other category is selected', () => {
      setTopic(ContactTopic.Data);
      setCategory(ContactCategory.SharingData);

      fixture.detectChanges();

      const feedbackFieldsComponent = fixture.debugElement.query((el) => el.name === 'app-feedback-fields-form-part');
      expect(feedbackFieldsComponent).toBeFalsy();
    });
  });
});
