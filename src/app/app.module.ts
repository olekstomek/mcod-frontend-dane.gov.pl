//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { isPlatformBrowser } from '@angular/common';
import { HTTP_INTERCEPTORS, HttpClient, HttpClientModule } from '@angular/common/http';
//  runtime information about the current platform and the appId by injection.
import { APP_ID, APP_INITIALIZER, Inject, NgModule, PLATFORM_ID } from '@angular/core';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title, TransferState } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
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

import { TranslateLoader, TranslateModule, TranslateParser } from '@ngx-translate/core';
import { AccordionModule, ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { CookieService } from 'ngx-cookie-service';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { NgProgressModule } from 'ngx-progressbar';
import { NgProgressHttpModule } from 'ngx-progressbar/http';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
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
import { AboutComponent } from './pages/about/about.component';
import { DeclarationComponent } from './pages/declaration/declaration.component';
import { KnowledgeBaseModule } from './pages/knowledge-base/knowledge-base.module';
import { PreviewCmsComponent } from './pages/preview-cms/preview-cms.component';
import { RegulationsComponent } from './pages/regulations/regulations.component';
import { SearchResultsComponent } from './pages/search-results/search-results.component';
import { SitemapComponent } from './pages/sitemap/sitemap.component';
import { SurveyComponent } from './pages/survey/survey.component';

import { AuthGuard } from './user/auth/auth.guard';

export function flagsFactory(featureFlagService: FeatureFlagService) {
    return () => featureFlagService.initialize();
}

@NgModule({
    declarations: [
        AppComponent,
        HeaderComponent,
        FooterComponent,
        AboutComponent,
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
        DeclarationComponent
    ],
    imports: [
        // Add .withServerTransition() to support Universal rendering.
        // The application ID can be any identifier which is unique on the page.
        BrowserModule.withServerTransition({appId: 'otwarte-dane-ssr'}),
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
        NgxLocalStorageModule.forRoot({prefix: 'mcod'}),
        BrowserAnimationsModule,
        KnowledgeBaseModule,
    ],
    providers: [
        Title,
        AuthGuard,
        CookieService,
        LanguageBootstrapService,
        {provide: HTTP_INTERCEPTORS, useClass: UnregisteredInterceptor, multi: true},
        {provide: HTTP_INTERCEPTORS, useClass: OfflineInterceptorService, multi: true},
        {
            provide: APP_INITIALIZER,
            useFactory: flagsFactory,
            deps: [FeatureFlagService],
            multi: true
        }
    ],
    bootstrap: [AppComponent]
})
export class AppModule {
    constructor(@Inject(PLATFORM_ID) private platformId: Object,
                @Inject(APP_ID) private appId: string) {

        const platform = isPlatformBrowser(platformId) ? 'in the browser' : 'on the server';
        //console.log(`Running ${platform} with appId=${appId}`);
    }
}

export function HttpLoaderFactory(http: HttpClient, transferState: TransferState) {
    return new TranslateBrowserLoaderService(http, transferState);
}
