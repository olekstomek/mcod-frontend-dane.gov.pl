import { NgModule } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { BreadcrumbsKnowledgeBaseTabDataResolverService } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-knowledge-base-tab-data-resolver.service';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { SharedModule } from '@app/shared/shared.module';
import { AppBootstrapModule } from '@app/app-bootstrap/app-bootstrap.module';
import { BreadcrumbsArticleResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-article.resolver';

import { KnowledgeBaseRoutingModule } from './knowledge-base-routing.module';
import { KnowledgeBaseComponent } from './knowledge-base/knowledge-base.component';
import { KnowledgeBaseItemPreviewComponent } from './knowledge-base-item-preview/knowledge-base-item-preview.component';

import { KnowledgeBaseTabsComponent } from './knowledge-base-tabs/knowledge-base-tabs.component';
import { BreadcrumbsKnowledgeBaseDataResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-knowledge-data-resolver.service';
import { KnowledgeBaseItemDetailsComponent } from './knowledge-base-item-details/knowledge-base-item-details.component';


@NgModule({
    imports: [
        CommonModule,
        KnowledgeBaseRoutingModule,
        AppBootstrapModule,
        TranslateModule.forChild({
            parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }
        }),
        FormsModule,
        SharedModule,
        ReactiveFormsModule
    ],
    providers: [
        BreadcrumbsArticleResolver,
        BreadcrumbsKnowledgeBaseDataResolver,
        BreadcrumbsKnowledgeBaseTabDataResolverService
    ],
    declarations: [
        KnowledgeBaseComponent,
        KnowledgeBaseItemPreviewComponent,
        KnowledgeBaseTabsComponent,
        KnowledgeBaseItemDetailsComponent
    ]
})
export class KnowledgeBaseModule {
}
