//import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
//  runtime information about the current platform and the appId by injection.
import { PLATFORM_ID, APP_ID, Inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { NgProgressHttpModule } from '@ngx-progressbar/http';
import { NgProgressModule } from '@ngx-progressbar/core';
import { HttpClientModule } from '@angular/common/http';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BrowserModule, Title } from '@angular/platform-browser';
import { NgModule } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { TranslateModule, TranslateLoader, TranslateParser } from '@ngx-translate/core';
import { TranslateHttpLoader } from '@ngx-translate/http-loader';
import { AccordionModule, ModalModule, TabsModule, TooltipModule } from 'ngx-bootstrap';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { CookieService } from 'ngx-cookie-service';

import { AuthGuard } from './user/auth/auth.guard';
import { SharedModule } from '@app/shared/shared.module';
import { ServicesModule } from '@app/services/services.module';
import { HomeModule } from '@app/pages/home/home.module';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';
import { MainLayoutComponent } from '@app/layout/main-layout/main-layout.component';
import { EmbedLayoutComponent } from '@app/layout/embed-layout/embed-layout.component';
import { EmbeddedComponent } from '@app/pages/embedded/embedded.component';


import { AppBootstrapModule } from './app-bootstrap/app-bootstrap.module';
import { AppRoutingModule } from './app-routing.module';
import { AppComponent } from './app.component';
import { HeaderComponent } from './layout/header/header.component';
import { FooterComponent } from './layout/footer/footer.component';
import { AboutComponent } from './pages/about/about.component';
import { SitemapComponent } from './pages/sitemap/sitemap.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { KnowledgeBaseModule } from './pages/knowledge-base/knowledge-base.module';

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
        EmbeddedComponent
    ],
    imports: [
        // Add .withServerTransition() to support Universal rendering.
        // The application ID can be any identifier which is unique on the page.
        BrowserModule.withServerTransition({appId: 'otwarte-dane-ssr'}),
        AppRoutingModule,
        AppBootstrapModule,
        FormsModule,
        ReactiveFormsModule,
        HttpClientModule,
        HomeModule,
        ServicesModule.forRoot(),
        NgProgressModule.forRoot(),
        NgProgressHttpModule.forRoot(),
        SharedModule,
        ModalModule.forRoot(),
        TabsModule.forRoot(),
        AccordionModule.forRoot(),
        TooltipModule.forRoot(),
        NgxLocalStorageModule.forRoot({prefix: 'mcod'}),
        TranslateModule.forRoot({
            loader: {
                provide: TranslateLoader,
                useFactory: HttpLoaderFactory,
                deps: [HttpClient]
            },
            parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }
        }),
        BrowserAnimationsModule,
        KnowledgeBaseModule
    ],
    providers: [
        Title,
        AuthGuard,
        CookieService,
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

export function HttpLoaderFactory(http: HttpClient) {
    return new TranslateHttpLoader(http);
}
