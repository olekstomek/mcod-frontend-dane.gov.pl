import { Component, OnInit } from '@angular/core';

import { ObserveService } from '@app/services/observe.service';
import { BasicPageParams } from '@app/services/models/page-params';
import { ApiModel } from '@app/services/api/api-model';
import { SeoService } from '@app/services/seo.service';

/**
 * Followed Datasets Component
 */
@Component({
  selector: 'app-followed-datasets',
  templateUrl: './followed-datasets.component.html',
})
export class FollowedDatasetsComponent implements OnInit {
  /**
   * Default page params
   */
  params: BasicPageParams = {
    page: 1,
    per_page: 5,
    sort: '-modified',
  };

  /**
   * Array of items (followed objects)
   */
  items: any[];

  /**
   * Followed datasets
   */
  followedDatasets: any[];

  /**
   * Subscription type (i.e. 'dataset')
   */
  subscriptionType = ApiModel.DATASET;

  /**
   * Count of items (followed objects)
   */
  count: number;

  /**
   * @ignore
   */
  constructor(private seoService: SeoService, private observeService: ObserveService) {}

  /**
   * Initializes lists
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Datasets.Self', 'MyDashboard.FollowedObjects', 'MyDashboard.Self']);
    this.getSubscriptions();
  }

  /**
   * Remove subscription of a dataset by its index
   * @param {number} index
   */
  removeSubscription(index: number) {
    this.observeService.removeSubscription(this.followedDatasets[index]).subscribe(() => this.getSubscriptions());
  }

  /**
   * Updates query params on every user interaction
   * @param {any} params
   */
  updateParams(params: any) {
    this.params = Object.assign(this.params, params);
    this.getSubscriptions();
  }

  /**
   * Tracks list of items by single item id to prevent re-rendering of existing elements in the template
   * @param {any} index
   * @param {index} item
   * @returns {string}
   */
  trackById(index: number, item: any) {
    return item.id;
  }

  /**
   * Initializes lists of subscriptions and related datasets
   */
  private getSubscriptions() {
    this.observeService.getSubscriptions(this.subscriptionType, this.params).subscribe(subscriptions => {
      if (!subscriptions || !subscriptions['included'] || !subscriptions['data']) {
        if (this.items?.length > 0) {
          this.items = [];
          this.count = subscriptions['meta']['count'];
          this.followedDatasets = [];
        }
        return;
      }

      this.items = subscriptions['included'];
      this.count = subscriptions['meta']['count'];
      this.followedDatasets = subscriptions['data'] ? subscriptions['data'].map(subscription => subscription.id) : subscriptions['data'];
    });
  }
}
