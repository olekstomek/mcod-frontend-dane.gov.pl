import { Location } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';
import { APP_CONFIG } from '@app/app.config';
import { MainLayoutComponent } from '@app/layout/main-layout/main-layout.component';
import { PageNotFoundComponent } from '@app/page-not-found/page-not-found.component';
import { PreviewCmsComponent } from '@app/pages/preview-cms/preview-cms.component';
import { RegulationsComponent } from '@app/pages/regulations/regulations.component';
import { SearchResultsComponent } from '@app/pages/search-results/search-results.component';
import { SurveyComponent } from '@app/pages/survey/survey.component';
import { CmsLandingPageComponent } from '@app/shared/cms/cms-landing-page/cms-landing-page.component';
import { ActiveNewsletterComponent } from '@app/user/newsletter/active-newsletter/active-newsletter.component';
import { NewsletterComponent } from '@app/user/newsletter/newsletter.component';
import { UnsubcribeNewsletterComponent } from '@app/user/newsletter/unsubcribe-newsletter/unsubcribe-newsletter.component';
import {
  CacheMechanism,
  LocalizeParser,
  LocalizeRouterModule,
  LocalizeRouterSettings,
  ManualParserLoader,
} from '@gilsdav/ngx-translate-router';
import { TranslateService } from '@ngx-translate/core';
import { AboutComponent } from './pages/about/about.component';
import { DeclarationComponent } from './pages/declaration/declaration.component';
import { HomeComponent } from './pages/home/home.component';
import { SitemapComponent } from './pages/sitemap/sitemap.component';

export function localizeLoaderFactory(translate: TranslateService, location: Location, settings: LocalizeRouterSettings, http: HttpClient) {
  return new ManualParserLoader(translate, location, settings, APP_CONFIG.availableLanguages, 'ROUTES.', '!');
}

const routes: Routes = [
  {
    path: '!embed',
    loadChildren: () => import('./pages/embedded/embedded.module').then(m => m.EmbeddedModule),
  },
  {
    path: '',
    component: MainLayoutComponent,
    children: [
      { path: '', component: HomeComponent },
      { path: '!resource/!:id', redirectTo: '/embed/resource/:id', pathMatch: 'full' },
      { path: '!about', component: AboutComponent },
      { path: '!sitemap', component: SitemapComponent },

      {
        path: '!dataset',
        data: { breadcrumbs: { translationKey: 'Menu.Datasets' } },
        loadChildren: () => import('./pages/dataset/dataset.module').then(m => m.DatasetModule),
      },
      // remove with S40_innovation_routing.fe
      {
        path: '!application',
        data: { breadcrumbs: { translationKey: 'Applications.Self' } },
        loadChildren: () => import('./pages/applications/applications.module').then(m => m.ApplicationsModule),
      },
      {
        path: '!showcase',
        data: { breadcrumbs: { translationKey: 'Breadcrumbs.ShowcasesComponent' } },
        loadChildren: () => import('./pages/applications/applications.module').then(m => m.ApplicationsModule),
      },
      {
        path: '!institution',
        data: { breadcrumbs: { translationKey: 'Institutions.Self' } },
        loadChildren: () => import('./pages/institutions/institutions.module').then(m => m.InstitutionsModule),
      },
      {
        path: '!article',
        data: { breadcrumbs: { translationKey: 'Articles.News' } },
        loadChildren: () => import('./pages/articles/articles.module').then(m => m.ArticlesModule),
      },
      {
        path: '!knowledgebase',
        data: { breadcrumbs: { translationKey: 'KnowledgeBase.Self' } },
        loadChildren: () => import('./pages/knowledge-base/knowledge-base.module').then(m => m.KnowledgeBaseModule),
      },
      {
        path: '!user',
        loadChildren: () => import('./user/user.module').then(m => m.UserModule),
      },
      { path: '!refresh', component: SitemapComponent },
      { path: '!newsletter', component: NewsletterComponent },
      { path: '!search', component: SearchResultsComponent, pathMatch: 'full' },
      { path: '!newsletter/!subscribe/!:token', component: ActiveNewsletterComponent, pathMatch: 'full' },
      { path: '!newsletter/!unsubscribe/!:token', component: UnsubcribeNewsletterComponent, pathMatch: 'full' },
      {
        path: '!promotion',
        component: CmsLandingPageComponent,
        children: [
          {
            path: '**',
            component: CmsLandingPageComponent,
            data: { skipRouteLocalization: true },
          },
        ],
      },
      {
        path: '!regulations',
        component: RegulationsComponent,
      },
      {
        path: '!page',
        component: PreviewCmsComponent,
        children: [
          {
            path: '**',
            component: PreviewCmsComponent,
            data: { skipRouteLocalization: true },
          },
        ],
      },
      { path: '!declaration-of-accessibility', component: DeclarationComponent },
      {
        path: '!forms',
        children: [
          { path: '', redirectTo: '/', pathMatch: 'full' },
          { path: '**', component: SurveyComponent, data: { skipRouteLocalization: true } },
          {
            path: '!ankieta-o-portalu',
            component: SurveyComponent,
          },
        ],
      },
    ],
  },

  { path: '**', component: MainLayoutComponent, children: [{ path: '', component: PageNotFoundComponent }] },
];

/**
 * @ignore
 */
@NgModule({
  imports: [
    RouterModule.forRoot(routes),
    LocalizeRouterModule.forRoot(routes, {
      parser: {
        provide: LocalizeParser,
        useFactory: localizeLoaderFactory,
        deps: [TranslateService, Location, LocalizeRouterSettings],
      },
      cacheName: 'currentLang',
      cacheMechanism: CacheMechanism.Cookie,
      cookieFormat: '{{value}};{{expires}};path=/',
    }),
  ],
  exports: [RouterModule, LocalizeRouterModule],
})
export class AppRoutingModule {}
