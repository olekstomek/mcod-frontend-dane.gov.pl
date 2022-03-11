import { Component, OnDestroy, OnInit } from '@angular/core';
import { CmsService } from '@app/services/cms.service';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { Subscription } from 'rxjs';

import { ArticlesService } from '@app/services/articles.service';
import { NotificationsService } from '@app/services/notifications.service';

/**
 * News Component
 */
@Component({
  selector: 'home-news',
  templateUrl: './news.component.html',
  providers: [NotificationsService],
})
export class NewsComponent implements OnInit, OnDestroy {
  /**
   * Articles substription of news component
   */
  articlesSubstription: Subscription;

  /**
   * Items (articles) of news component
   */
  items;

  /**
   * @ignore
   */
  constructor(
    private articlesService: ArticlesService,
    private notificationsService: NotificationsService,
    private featureflagService: FeatureFlagService,
    private cmsService: CmsService,
  ) {}

  /**
   * Initializes list of items (articles from one category - news).
   */
  ngOnInit() {
    if (this.featureflagService.validateFlagSync('S46_articles_form_cms.fe')) {
      this.articlesSubstription = this.cmsService
        .getAllNewsWidgets({ children_page: 1, children_per_page: 3, sort: '-created', children_extra_fields: 'body,author,tags' })
        .subscribe(news => (this.items = news.data));
    } else {
      this.articlesSubstription = this.articlesService
        .getAll({ per_page: 3, sort: '-created', category: 1 })
        .subscribe(news => (this.items = news.results));
    }
  }

  /**
   * Unsubscribes from existing subscriptions
   */
  ngOnDestroy() {
    this.articlesSubstription.unsubscribe();
  }
}
