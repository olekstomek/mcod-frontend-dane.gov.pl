import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';

import { ArticleComponent } from './article/article.component';
import { ArticleItemComponent } from './article-item/article-item.component';
import { BreadcrumbsArticleResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-article.resolver';

const routes: Routes = [
    { path: '', component: ArticleComponent },
    {
        path: ':id', 
        component: ArticleItemComponent, 
        data: {
            breadcrumbs: '{{ post.attributes.title }}'
        },
        resolve: {
            post: BreadcrumbsArticleResolver
        }
    }];
    
/**
 * @ignore
 */
@NgModule({
    imports: [RouterModule.forChild(routes)],
    exports: [RouterModule]
})
export class ArticlesRoutingModule { }
