import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { SitemapComponent } from '@app/pages/sitemap/sitemap.component';
import { ListViewDetailsService } from '@app/services/list-view-details.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SearchService } from '@app/services/search.service';
import { SeoService } from '@app/services/seo.service';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { of } from 'rxjs/internal/observable/of';

class SeoServiceStub {
  setPageTitleByTranslationKey() {}
}

describe('SitemapComponent', () => {
  let component: SitemapComponent;
  let fixture: ComponentFixture<SitemapComponent>;
  let service: SeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SitemapComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxLocalStorageModule.forRoot(),
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
      ],
      providers: [{ provide: SeoService, useClass: SeoServiceStub }],
    }).compileComponents();

    service = TestBed.inject(SeoService);
    fixture = TestBed.createComponent(SitemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });
});
