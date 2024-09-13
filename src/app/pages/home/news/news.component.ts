import { Component, OnDestroy, OnInit } from '@angular/core';
import { CmsService } from '@app/services/cms.service';
import { Subscription } from 'rxjs';
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
  constructor(private notificationsService: NotificationsService, private cmsService: CmsService) {}

  /**
   * Initializes list of items (articles from one category - news).
   */
  ngOnInit() {
    this.articlesSubstription = this.cmsService
      .getAllNewsWidgets({
        children_page: 1,
        children_per_page: 3,
        children_sort: '-first_published_at',
        children_extra_fields: 'body,author,tags',
      })
      .subscribe(news => (this.items = news.data));
  }

  /**
   * Unsubscribes from existing subscriptions
   */
  ngOnDestroy() {
    this.articlesSubstription.unsubscribe();
  }
}
