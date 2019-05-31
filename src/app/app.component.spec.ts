import { TestBed, async } from '@angular/core/testing';
import { AppComponent } from './app.component';
import { HomeModule } from '@app/pages/home/home.module';
import { TranslateModule } from '@ngx-translate/core';
import { SharedModule } from '@app/shared/shared.module';
import { AppRoutingModule } from '@app/app-routing.module';
import { BrowserModule } from '@angular/platform-browser';
import { FooterComponent } from '@app/layout/footer/footer.component';
import { HeaderComponent } from '@app/layout/header/header.component';
import { AboutComponent } from '@app/pages/about/about.component';
import { SitemapComponent } from '@app/pages/sitemap/sitemap.component';
import { PageNotFoundComponent } from '@app/page-not-found/page-not-found.component';
import { APP_BASE_HREF } from '@angular/common';
import { MainLayoutComponent } from '@app/layout/main-layout/main-layout.component';
import { EmbedLayoutComponent } from '@app/layout/embed-layout/embed-layout.component';
import { EmbeddedComponent } from '@app/pages/embedded/embedded.component';
import { NgProgressModule } from '@ngx-progressbar/core';

describe('AppComponent', () => {
    beforeEach(async(() => {
        TestBed.configureTestingModule({
            providers: [{provide: APP_BASE_HREF, useValue: '/api'}],
            imports: [
                HomeModule,
                SharedModule,
                NgProgressModule,
                // Add .withServerTransition() to support Universal rendering.
                // The application ID can be any identifier which is unique on the page.
                BrowserModule.withServerTransition({appId: 'otwarte-dane-ssr'}),
                AppRoutingModule,
                TranslateModule.forRoot({})
            ],
            declarations: [
                AppComponent,
                HeaderComponent,
                FooterComponent,
                AboutComponent,
                SitemapComponent,
                MainLayoutComponent,
                EmbedLayoutComponent,
                EmbeddedComponent,
                PageNotFoundComponent
            ]
        }).compileComponents();

    }));
    it('should create the app', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        const app = fixture.debugElement.componentInstance;
        expect(app).toBeTruthy();
    }));
    it('should render main tag with router-outlet', async(() => {
        const fixture = TestBed.createComponent(AppComponent);
        fixture.detectChanges();
        const compiled = fixture.debugElement.nativeElement as HTMLElement;
        expect(compiled.querySelector('router-outlet').innerHTML).toBeDefined();
    }));
});
