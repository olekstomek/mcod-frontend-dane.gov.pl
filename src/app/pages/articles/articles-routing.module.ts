import { NgModule } from '@angular/core';
import { Routes, RouterModule } from '@angular/router';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';

import { ArticleComponent } from './article/article.component';
import { ArticleItemComponent } from './article-item/article-item.component';
import { BreadcrumbsArticleResolver } from '@app/shared/breadcrumbs/resolvers/breadcrumbs-article.resolver';

const routes: Routes = [
  {
    path: '',
    component: ArticleComponent
  },
  {
    path: '!:id',
    component: ArticleItemComponent,
    data: {
      breadcrumbs: { dataKey: 'post.attributes.title' },
    },
    resolve: {
      post: BreadcrumbsArticleResolver,
    },
  },
];

/**
 * @ignore
 */
@NgModule({
  imports: [RouterModule.forChild(routes), LocalizeRouterModule.forChild(routes)],
  exports: [RouterModule, LocalizeRouterModule],
})
export class ArticlesRoutingModule {}
