import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { SeoService } from '@app/services/seo.service';
import { ContactFormComponent } from './contact-form.component';
import { ContactCategory, ContactTopic } from './contact-form-models';

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
        setTopic(topic);
        component.mainForm.controls.category.setValue(category);

        expect(component.mainForm.valid).toBe(true);
      },
    );

    it.each(TOPICS_WITHOUT_CATEGORY)(
      'should be valid when topic $name is selected (no category required)',
      ({ topic }) => {
        setTopic(topic);

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
        setTopic(topic);
        component.mainForm.controls.category.setValue(category);

        component.onFormSubmit();

        expect(component.isFormSent()).toBe(true);
      },
    );

    it.each(TOPICS_WITHOUT_CATEGORY)(
      'should submit when topic $name is selected (no category required)',
      ({ topic }) => {
        setTopic(topic);

        component.onFormSubmit();

        expect(component.isFormSent()).toBe(true);
      },
    );
  });
});
