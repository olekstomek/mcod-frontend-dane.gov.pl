import { NgModule } from '@angular/core';
import { RouterModule, Routes } from '@angular/router';

import { KnowledgeBaseItemDetailsComponent } from '@app/pages/knowledge-base/knowledge-base-item-details/knowledge-base-item-details.component';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { BreadcrumbsArticleResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-article.resolver';
import { BreadcrumbsKnowledgeBaseTabDataResolverService } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-knowledge-base-tab-data-resolver.service';
import { BreadcrumbsKnowledgeBaseDataResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-knowledge-data-resolver.service';
import { CmsLandingPageComponent } from '@app/shared/cms/cms-landing-page/cms-landing-page.component';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { KnowledgeBaseItemPreviewComponent } from './knowledge-base-item-preview/knowledge-base-item-preview.component';
import { KnowledgeBaseTabsComponent } from './knowledge-base-tabs/knowledge-base-tabs.component';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';

/**
 * Router endpoints
 */
const routerEndpoints = RouterEndpoints;

const routes: Routes = [
    {
        path: '', component: KnowledgeBaseComponent, children: [

            // general article preview
            {
                path: `!${routerEndpoints.PREVIEW}/!:id`, component: KnowledgeBaseItemPreviewComponent,
                data: {
                    breadcrumbs: {dataKey: 'post.attributes.title'}
                },
                resolve: {
                    post: BreadcrumbsArticleResolver
                }
            },

            // tabs
            {
                path: '',
                component: KnowledgeBaseTabsComponent,
                children: [
                    { path: '', redirectTo: '!' + routerEndpoints.MULTIMEDIA_TRAINING, pathMatch: 'full' },
                    {
                        path: '!' + routerEndpoints.MULTIMEDIA_TRAINING,
                        component: CmsLandingPageComponent,
                        resolve: {
                            children: BreadcrumbsKnowledgeBaseTabDataResolverService
                        },
                        data: {
                            slug: routerEndpoints.MULTIMEDIA_TRAINING,
                            showFooter: true,
                            breadcrumbs: {dataKey: 'children.0.title'},
                        }
                    },
                    {
                        path: '!' + routerEndpoints.USEFUL_MATERIALS,
                        component: CmsLandingPageComponent,
                        resolve: {
                            children: BreadcrumbsKnowledgeBaseTabDataResolverService
                        },
                        data: {
                            cssContainerClass: 'cms-tiles',
                            slug: routerEndpoints.USEFUL_MATERIALS,
                            showFooter: true,
                            breadcrumbs: {dataKey: 'children.1.title'},
                        },
                        children: [
                            {
                                path: `!:id`,
                                component: KnowledgeBaseItemDetailsComponent,
                                data: {details: true, breadcrumbs: {dataKey: 'post.title'}},
                                resolve: {post: BreadcrumbsKnowledgeBaseDataResolver}
                            },
                        ]
                    },
                    {
                        path: '!' + routerEndpoints.EVENTS,
                        component: CmsLandingPageComponent,
                        resolve: {
                            children: BreadcrumbsKnowledgeBaseTabDataResolverService
                        },
                        data: {
                            cssContainerClass: 'cms-tiles',
                            slug: routerEndpoints.EVENTS,
                            showFooter: true,
                            breadcrumbs: {dataKey: 'children.2.title'},
                        },
                        children: [
                            {
                                path: `!:id`,
                                component: KnowledgeBaseItemDetailsComponent,
                                data: {details: true, breadcrumbs: {dataKey: 'post.title'}},
                                resolve: {post: BreadcrumbsKnowledgeBaseDataResolver}
                            },
                        ]
                    }
                ],
                resolve: {
                    post: BreadcrumbsKnowledgeBaseDataResolver
                }
            }
        ]
    },
];

@NgModule({
    imports: [
        RouterModule.forChild(routes),
        LocalizeRouterModule.forChild(routes),
    ],
    exports: [RouterModule, LocalizeRouterModule]
})
export class KnowledgeBaseRoutingModule {
}
