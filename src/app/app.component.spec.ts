import { TestBed, async, inject } from '@angular/core/testing';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { AppComponent } from './app.component';
import { HomeModule } from '@app/pages/home/home.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { AppRoutingModule } from '@app/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { FooterComponent } from '@app/layout/footer/footer.component';
import { HeaderComponent } from '@app/layout/header/header.component';
import { SitemapComponent } from '@app/pages/sitemap/sitemap.component';
import { PageNotFoundComponent } from '@app/page-not-found/page-not-found.component';
import { APP_BASE_HREF } from '@angular/common';
import { MainLayoutComponent } from '@app/layout/main-layout/main-layout.component';
import { EmbedLayoutComponent } from '@app/layout/embed-layout/embed-layout.component';
import { EmbeddedComponent } from '@app/pages/embedded/embedded.component';
import { NgProgressModule } from 'ngx-progressbar';
import { ActivityNotificationsComponent } from '@app/layout/header/activity-notifications/activity-notifications.component';
import { LocalStorageService } from 'ngx-localstorage';
import { BsLocaleService } from 'ngx-bootstrap';
import { NewsletterComponent } from '@app/user/newsletter/newsletter.component';
import { ActiveNewsletterComponent } from '@app/user/newsletter/active-newsletter/active-newsletter.component';
import { UnsubcribeNewsletterComponent } from '@app/user/newsletter/unsubcribe-newsletter/unsubcribe-newsletter.component';
import { HttpClient } from '@angular/common/http';
import { RegulationsComponent } from '@app/pages/regulations/regulations.component';
import { PreviewCmsComponent } from '@app/pages/preview-cms/preview-cms.component';
import { LanguageBootstrapService } from '@app/services/language-bootstrap.service';
import { SearchResultsComponent } from '@app/pages/search-results/search-results.component';
import { SurveyComponent } from '@app/pages/survey/survey.component';
import { FooterNavLinkExternalComponent } from '@app/layout/footer/footer-nav-link-external/footer-nav-link-external.component';
import { FooterNavLinkInternalComponent } from '@app/layout/footer/footer-nav-link-internal/footer-nav-link-internal.component';
import { FooterNavListComponent } from '@app/layout/footer/footer-nav-list/footer-nav-list.component';

describe('AppComponent', () => {
  beforeEach(async(() => {
    TestBed.configureTestingModule({
      providers: [
        { provide: APP_BASE_HREF, useValue: '/api' },
        { provide: LocalStorageService, useValue: LocalStorageService },
        { provide: HttpClient, useValue: HttpClient },
        { provide: BsLocaleService, useValue: BsLocaleService },
        { provide: LanguageBootstrapService, useValue: LanguageBootstrapService },
      ],
      imports: [
        HomeModule,
        SharedModule,
        NgProgressModule,
        FormsModule,
        ReactiveFormsModule,
        // Add .withServerTransition() to support Universal rendering.
        // The application ID can be any identifier which is unique on the page.
        BrowserModule.withServerTransition({ appId: 'otwarte-dane-ssr' }),
        AppRoutingModule,
        TranslateModule.forRoot({}),
        LocalizeRouterModule.forRoot([]),
      ],
      declarations: [
        AppComponent,
        HeaderComponent,
        ActivityNotificationsComponent,
        FooterComponent,
        FooterNavLinkExternalComponent,
        FooterNavLinkInternalComponent,
        FooterNavListComponent,
        PreviewCmsComponent,
        RegulationsComponent,
        SitemapComponent,
        MainLayoutComponent,
        EmbedLayoutComponent,
        EmbeddedComponent,
        PageNotFoundComponent,
        NewsletterComponent,
        ActiveNewsletterComponent,
        UnsubcribeNewsletterComponent,
        SearchResultsComponent,
        SurveyComponent,
      ],
    }).compileComponents();
  }));

  it('should create the app', async(() => {
    const fixture = TestBed.createComponent(AppComponent);
    const app = fixture.debugElement.componentInstance;
    expect(app).toBeTruthy();
  }));

  it('should render main tag with router-outlet', async(() => {
    inject([LocalStorageService], (localstorage: LocalStorageService) => {
      const fixture = TestBed.createComponent(AppComponent);
      fixture.detectChanges();
      const compiled = fixture.debugElement.nativeElement as HTMLElement;

      expect(compiled.querySelector('router-outlet').innerHTML).toBeDefined();
    });
  }));
});
