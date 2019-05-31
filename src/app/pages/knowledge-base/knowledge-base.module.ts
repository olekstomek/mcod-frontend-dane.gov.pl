import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { SharedModule } from '@app/shared/shared.module';
import { AppBootstrapModule } from '@app/app-bootstrap/app-bootstrap.module';
import { BreadcrumbsArticleResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-article.resolver';

import { KnowledgeBaseRoutingModule } from './knowledge-base-routing.module';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { KnowledgeBaseItemPreviewComponent } from './knowledge-base-item-preview/knowledge-base-item-preview.component';

import { KnowledgeBaseTabsComponent } from './knowledge-base-tabs/knowledge-base-tabs.component';
import { KnowledgeBaseTabHelpComponent } from './knowledge-base-tab-help/knowledge-base-tab-help.component';
import { KnowledgeBaseTabEducationComponent } from './knowledge-base-tab-education/knowledge-base-tab-education.component';
import { KnowledgeBaseTabFaqComponent } from './knowledge-base-tab-faq/knowledge-base-tab-faq.component';
import { KnowledgeBaseTabListComponent } from './knowledge-base-tab-list/knowledge-base-tab-list.component';
import { KnowledgeBaseTabItemComponent } from './knowledge-base-tab-item/knowledge-base-tab-item.component';


@NgModule({
    imports: [
        CommonModule,
        KnowledgeBaseRoutingModule,
        AppBootstrapModule,
        TranslateModule.forChild({parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }}),
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    providers: [BreadcrumbsArticleResolver],
    declarations: [
        KnowledgeBaseComponent, 
        KnowledgeBaseItemPreviewComponent,
        KnowledgeBaseTabsComponent, 
        KnowledgeBaseTabHelpComponent, 
        KnowledgeBaseTabEducationComponent,
        KnowledgeBaseTabFaqComponent,
        KnowledgeBaseTabListComponent, 
        KnowledgeBaseTabItemComponent
    ]
})
export class KnowledgeBaseModule { }
