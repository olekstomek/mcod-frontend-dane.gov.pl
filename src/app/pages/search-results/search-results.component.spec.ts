import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ListViewDetailsService } from '@app/services/list-view-details.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SearchService } from '@app/services/search.service';
import { SeoService } from '@app/services/seo.service';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { SearchResultsComponent } from './search-results.component';

class SeoServiceStub {
  setPageTitleByTranslationKey() {}
}

class LocalizeRouterServiceStub {}

describe('SearchResultsComponent', () => {
  let component: SearchResultsComponent;
  let fixture: ComponentFixture<SearchResultsComponent>;
  let service: ListViewDetailsService;
  let seoService: SeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchResultsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NgxLocalStorageModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: SeoService, useClass: SeoServiceStub },
        { provide: LocalizeRouterService, useClass: LocalizeRouterServiceStub },
        ListViewDetailsService,
        SearchService,
        NotificationsService,
      ],
    }).compileComponents();

    service = TestBed.inject(ListViewDetailsService);
    seoService = TestBed.inject(SeoService);
    fixture = TestBed.createComponent(SearchResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });
});
