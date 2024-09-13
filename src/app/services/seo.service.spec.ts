import { TestBed } from '@angular/core/testing';
import { ServiceTestbed } from '@app/services/tests/service.testbed';
import { StringHelper } from '@app/shared/helpers/string.helper';

import { SeoService } from './seo.service';

describe('SeoService', () => {
  let service: SeoService;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(SeoService));

    service = TestBed.inject(SeoService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call setPageTitle function', () => {
    const spyFunction = spyOn(service, 'setPageTitle');
    service.setPageTitle('title');

    expect(spyFunction).toBeCalled();
  });

  it('should call setDescriptionFromText function', () => {
    const spyFunction = spyOn(service, 'setDescriptionFromText');
    service.setDescriptionFromText('test');

    expect(spyFunction).toBeCalled();
  });

  it('should call setPageTitleByTranslationKey function', () => {
    const spyFunction = spyOn(service, 'setPageTitleByTranslationKey');
    service.setPageTitleByTranslationKey(['translationKeys']);

    expect(spyFunction).toBeCalled();
  });

  it('should call setInitialMetaDescription function', () => {
    const spyFunction = spyOn(service, 'setInitialMetaDescription');
    service.setInitialMetaDescription();

    expect(spyFunction).toBeCalled();
  });

  it('check page description', () => {
    const text = 'to jest test';
    const limitWords = 30;
    const pageDesc = StringHelper.stripHtmlTags(text.split(' ').splice(0, limitWords).join(' ')) + '...';

    expect(pageDesc).toEqual(text + '...');
  });
});
