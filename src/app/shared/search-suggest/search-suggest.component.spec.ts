import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ApiModel } from '@app/services/api/api-model';
import { NotificationsService } from '@app/services/notifications.service';
import { SearchSuggestionsService } from '@app/services/search-suggestions.service';
import { SearchSuggestComponent } from '@app/shared/search-suggest/search-suggest.component';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';

class LocalizeRouterServiceStub {}

describe('SearchSuggestComponent', () => {
  let component: SearchSuggestComponent;
  let fixture: ComponentFixture<SearchSuggestComponent>;
  let service: SearchSuggestionsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchSuggestComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxLocalStorageModule.forRoot(),
        TranslateModule.forRoot(),
        NoopAnimationsModule,
      ],
      providers: [SearchSuggestionsService, NotificationsService, { provide: LocalizeRouterService, useClass: LocalizeRouterServiceStub }],
    }).compileComponents();

    service = TestBed.inject(SearchSuggestionsService);
    fixture = TestBed.createComponent(SearchSuggestComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should populates suggestions list, toggles suggestions list, reset active descendant index', () => {
    const item = [{ title: 'test', url: 'localhost' }];
    component.toggleDropdown(item);
    expect(component.listBoxOptions).toEqual(item);
    expect(component.isListBoxExpanded).toBe(true);
  });

  it('should creates listbox option from a data item of the api response for ApiModel.ARTICLE', () => {
    const item = { attributes: { title: 'test', model: ApiModel.ARTICLE, slug: 'articles' }, id: '2' };
    const returnValue = component.createListboxOptionFromItem(item);
    expect(returnValue).toStrictEqual({ title: 'test', url: '/article/2,articles', areaTranslationKey: 'Articles.News' });
  });

  it('should creates listbox option from a data item of the api response for ApiModel.SHOWCASE', () => {
    const item = { attributes: { title: 'test', model: ApiModel.SHOWCASE, slug: 'showcases' }, id: '2' };
    const returnValue = component.createListboxOptionFromItem(item);
    expect(returnValue).toStrictEqual({ title: 'test', url: '/showcase/2,showcases', areaTranslationKey: 'Menu.Showcases' });
  });

  it('should creates listbox option from a data item of the api response for ApiModel.KNOWLEDGE_BASE', () => {
    const item = {
      attributes: { title: 'test', model: ApiModel.KNOWLEDGE_BASE, slug: 'knowledge_base', html_url: 'pl/knowledgebase/useful-materials/' },
      id: '2',
    };
    const returnValue = component.createListboxOptionFromItem(item);
    expect(returnValue).toStrictEqual({ title: 'test', url: '/knowledgebase/useful-materials', areaTranslationKey: 'KnowledgeBase.Self' });
  });

  it('should creates listbox option from a data item of the api response for ApiModel.NEWS', () => {
    const item = { attributes: { title: 'test', model: ApiModel.NEWS, slug: 'news' }, id: '2' };
    const returnValue = component.createListboxOptionFromItem(item);
    expect(returnValue).toStrictEqual({ title: 'test', url: '/article/news', areaTranslationKey: 'Articles.News' });
  });

  it('should creates listbox option from a data item of the api response for ApiModel.RESOURCE', () => {
    const item = { attributes: { title: 'test', model: ApiModel.RESOURCE, slug: 'resource' }, id: '2' };
    const returnValue = component.createListboxOptionFromItem(item);
    expect(returnValue).toStrictEqual({ title: 'test', url: '/resource/2,resource', areaTranslationKey: 'Resources.Self' });
  });

  it('should parses knowledge base url', () => {
    const url = 'pl/knowledgebase/useful-materials/';
    const returnValue = component.parseKnowledgeBaseUrl(url);
    expect(returnValue).toBe('/knowledgebase/useful-materials');
  });

  it('should prepares listbox options', () => {
    const item = [{ attributes: { title: 'test', model: ApiModel.NEWS, slug: 'news' }, id: '2' }];
    const returnValue = component.prepareListboxOptions(item);
    expect(returnValue).toStrictEqual([{ title: 'test', url: '/article/news', areaTranslationKey: 'Articles.News' }]);
  });
});
