//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
//  runtime information about the current platform and the appId by injection.
import { APP_ID, APP_INITIALIZER, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title, TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { Router } from '@angular/router';
import { APP_CONFIG } from '@app/app.config';
import { EmbedLayoutComponent } from '@app/layout/embed-layout/embed-layout.component';
import { MainLayoutComponent } from '@app/layout/main-layout/main-layout.component';
import { HomeModule } from '@app/pages/home/home.module';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { OfflineInterceptorService } from '@app/services/http/offline-interceptor.service';
import { LanguageBootstrapService } from '@app/services/language-bootstrap.service';
import { ServicesModule } from '@app/services/services.module';
import { UnregisteredInterceptor } from '@app/services/unregistered-interceptor';
import { SharedModule } from '@app/shared/shared.module';
import { TransferHttpCacheModule } from '@app/ssr/transfer-http-cache.module';
import { TranslateBrowserLoaderService } from '@app/ssr/translate-browser-loader.service';
import { ActiveNewsletterComponent } from '@app/user/newsletter/active-newsletter/active-newsletter.component';

import { NewsletterComponent } from '@app/user/newsletter/newsletter.component';
import { UnsubcribeNewsletterComponent } from '@app/user/newsletter/unsubcribe-newsletter/unsubcribe-newsletter.component';

import { TranslateModule } from '@ngx-translate/core';
import { AccordionModule, ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { PrebootModule } from 'preboot';

import { AppBootstrapModule } from './app-bootstrap/app-bootstrap.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { FooterNavLinkExternalComponent } from './layout/footer/footer-nav-link-external/footer-nav-link-external.component';
import { FooterNavLinkInternalComponent } from './layout/footer/footer-nav-link-internal/footer-nav-link-internal.component';
import { FooterNavListComponent } from './layout/footer/footer-nav-list/footer-nav-list.component';
import { FooterComponent } from './layout/footer/footer.component';
import { ActivityNotificationsComponent } from './layout/header/activity-notifications/activity-notifications.component';
import { HeaderComponent } from './layout/header/header.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { DeclarationComponent } from './pages/declaration/declaration.component';
import { KnowledgeBaseModule } from './pages/knowledge-base/knowledge-base.module';
import { PreviewCmsComponent } from './pages/preview-cms/preview-cms.component';
import { RegulationsComponent } from './pages/regulations/regulations.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { SitemapComponent } from './pages/sitemap/sitemap.component';
import { SurveyComponent } from './pages/survey/survey.component';
import * as Sentry from '@sentry/angular';
import { environment } from '@env/environment';
import { NgxMatomoRouterModule } from '@ngx-matomo/router';
import { MATOMO_CONFIGURATION, NgxMatomoTrackerModule } from '@ngx-matomo/tracker';

import { AuthGuard } from './user/auth/auth.guard';

export function flagsFactory(featureFlagService: FeatureFlagService) {
  return () => featureFlagService.initialize();
}
Sentry.init({
  dsn: 'https://23ce4d6805ae4ba0ae5954f33aaf9246@apm.dane.gov.pl//12',
  environment: environment.name,
  tracesSampleRate: 1.0,
});

@NgModule({
  declarations: [
    AppComponent,
    HeaderComponent,
    FooterComponent,
    MainLayoutComponent,
    EmbedLayoutComponent,
    PageNotFoundComponent,
    SitemapComponent,
    ActivityNotificationsComponent,
    NewsletterComponent,
    ActiveNewsletterComponent,
    UnsubcribeNewsletterComponent,
    RegulationsComponent,
    PreviewCmsComponent,
    SearchResultsComponent,
    SurveyComponent,
    FooterNavListComponent,
    FooterNavLinkInternalComponent,
    FooterNavLinkExternalComponent,
    DeclarationComponent,
  ],
  imports: [
    // Add .withServerTransition() to support Universal rendering.
    // The application ID can be any identifier which is unique on the page.
    BrowserModule.withServerTransition({ appId: 'otwarte-dane-ssr' }),
    PrebootModule.withConfig({ appRoot: 'app-root' }),
    TransferHttpCacheModule,
    AppRoutingModule,
    AppBootstrapModule,
    FormsModule,
    ReactiveFormsModule,
    HttpClientModule,
    HomeModule,
    ServicesModule.forRoot(),
    NgProgressModule,
    NgProgressHttpModule,
    SharedModule,
    ModalModule.forRoot(),
    TabsModule.forRoot(),
    AccordionModule.forRoot(),
    TooltipModule.forRoot(),
    TranslateModule.forChild(),
    NgxLocalStorageModule.forRoot({ prefix: 'mcod' }),
    BrowserAnimationsModule,
    KnowledgeBaseModule,
    NgxMatomoTrackerModule,
    NgxMatomoRouterModule,
  ],
  providers: [
    Title,
    AuthGuard,
    CookieService,
    LanguageBootstrapService,
    { provide: HTTP_INTERCEPTORS, useClass: UnregisteredInterceptor, multi: true },
    { provide: HTTP_INTERCEPTORS, useClass: OfflineInterceptorService, multi: true },
    {
      provide: APP_INITIALIZER,
      useFactory: flagsFactory,
      deps: [FeatureFlagService],
      multi: true,
    },
    {
      provide: Sentry.TraceService,
      deps: [Router],
    },
    {
      provide: MATOMO_CONFIGURATION,
      useFactory: matomoConfigFactory,
      deps: [PLATFORM_ID],
    },
  ],
  bootstrap: [AppComponent],
})
export class AppModule {
  constructor(@Inject(PLATFORM_ID) private platformId: Object, @Inject(APP_ID) private appId: string, trace: Sentry.TraceService) {
    const platform = isPlatformBrowser(platformId) ? 'in the browser' : 'on the server';
    //console.log(`Running ${platform} with appId=${appId}`);
  }
}

export function HttpLoaderFactory(http: HttpClient, transferState: TransferState) {
  return new TranslateBrowserLoaderService(http, transferState);
}

export function matomoConfigFactory(platformId: Object) {
  let matomoSiteId: string;
  if (isPlatformBrowser(platformId)) {
    switch (document.location.hostname) {
      case 'dane.gov.pl':
        matomoSiteId = '5';
        break;
      case 'localhost':
      case 'dev.dane.gov.pl':
        matomoSiteId = '2';
        break;
      case 'int.dane.gov.pl':
        matomoSiteId = '3';
        break;
      case 'szkolenia.dane.gov.pl':
        matomoSiteId = '4';
        break;
    }
  }

  return {
    disabled: !isPlatformBrowser(platformId),
    siteId: matomoSiteId,
    trackerUrl: APP_CONFIG.matomoTrackerUrl,
  };
}
