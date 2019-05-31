import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { BreadcrumbsArticleResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-article.resolver';

import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { KnowledgeBaseItemPreviewComponent } from './knowledge-base-item-preview/knowledge-base-item-preview.component';

import { KnowledgeBaseTabsComponent } from './knowledge-base-tabs/knowledge-base-tabs.component';
import { KnowledgeBaseTabHelpComponent } from './knowledge-base-tab-help/knowledge-base-tab-help.component';
import { KnowledgeBaseTabEducationComponent } from './knowledge-base-tab-education/knowledge-base-tab-education.component';
import { KnowledgeBaseTabFaqComponent } from './knowledge-base-tab-faq/knowledge-base-tab-faq.component';
import { KnowledgeBaseTabListComponent } from './knowledge-base-tab-list/knowledge-base-tab-list.component';
import { KnowledgeBaseTabItemComponent } from './knowledge-base-tab-item/knowledge-base-tab-item.component';


const routes: Routes = [
    { 
        path: '', component: KnowledgeBaseComponent, children: [

            // general article preview
            {
                path: 'preview/:id', component: KnowledgeBaseItemPreviewComponent, 
                data: {
                    breadcrumbs: '{{ post.attributes.title }}'
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
                    {path: '', redirectTo: 'education', pathMatch: 'full'},

                    // education
                    {path: 'education', component: KnowledgeBaseTabEducationComponent, children: [
                        {path: '', component: KnowledgeBaseTabListComponent, data: { category: 3 }},
                        {
                            path: ':id', component: KnowledgeBaseTabItemComponent, 
                            data: {
                                breadcrumbs: '{{ post.attributes.title }}'
                            },
                            resolve: {
                                post: BreadcrumbsArticleResolver
                            }
                        },
                    ]},

                    // faq
                    {path: 'faq', component: KnowledgeBaseTabFaqComponent},

                    // help
                    {path: 'help', component: KnowledgeBaseTabHelpComponent, children: [
                        {path: '', component: KnowledgeBaseTabListComponent, data: { category: 2 }},
                        {
                            path: ':id', component: KnowledgeBaseTabItemComponent, 
                            data: {
                                breadcrumbs: '{{ post.attributes.title }}'
                            },
                            resolve: {
                                post: BreadcrumbsArticleResolver
                            }
                        },
                    ]},
                    
                    {path: '**', redirectTo: 'education', pathMatch: 'full'}
                ]
            }
        ] 
    },
];

/**
 * @ignore
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class KnowledgeBaseRoutingModule { }
