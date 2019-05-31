import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { SitemapComponent } from './pages/sitemap/sitemap.component';
import { AboutComponent } from './pages/about/about.component';
import { PageNotFoundComponent } from './page-not-found/page-not-found.component';
import { HomeComponent } from './pages/home/home.component';
import { MainLayoutComponent } from '@app/layout/main-layout/main-layout.component';
import { EmbedLayoutComponent } from '@app/layout/embed-layout/embed-layout.component';
import { EmbeddedComponent } from '@app/pages/embedded/embedded.component';
// my account

// TODO: Language appropriate routing
const routes: Routes = [
    {
        path: 'embed', component: EmbedLayoutComponent, children: [
            {path: 'resource/:id', component: EmbeddedComponent},
        ]
    },
    {
        path: '', component: MainLayoutComponent, children: [
            {path: '', component: HomeComponent},
            {path: 'resource/:id',   redirectTo: '/embed/resource/:id', pathMatch: 'full' },
            {path: 'about', component: AboutComponent},
            {path: 'sitemap', component: SitemapComponent},

            {path: 'dataset', loadChildren: './pages/dataset/dataset.module#DatasetModule'},
            {path: 'application', loadChildren: './pages/applications/applications.module#ApplicationsModule'},
            {path: 'institution', loadChildren: './pages/institutions/institutions.module#InstitutionsModule'},
            {path: 'article', loadChildren: './pages/articles/articles.module#ArticlesModule'},
            {path: 'knowledge-base', loadChildren: './pages/knowledge-base/knowledge-base.module#KnowledgeBaseModule'},
            {path: 'user', loadChildren: './user/user.module#UserModule'},
            {path: '**', component: PageNotFoundComponent}
        ]
    },
];

/**
 * @ignore
 */
@NgModule({
    imports: [RouterModule.forRoot(routes)],
    exports: [RouterModule]
})
export class AppRoutingModule {
}
