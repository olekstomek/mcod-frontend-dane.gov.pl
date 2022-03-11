import { Injectable } from '@angular/core';

import { ISearchResult, ISearchResultAttributes } from '@app/services/models/search';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { ApiModel } from '@app/services/api/api-model';

/**
 * Service to build model of data details to display on list
 */
@Injectable({
  providedIn: 'root',
})
export class ListViewDetailsService {
  /**
   * Router endpoints
   */
  readonly routerEndpoints = RouterEndpoints;

  /**
   * Extends items objects with translations and details to display on list
   * @param {ISearchResult[]} items
   * @return {ISearchResult[]}
   */
  extendViewDetails(items: ISearchResult[]): ISearchResult[] {
    items.map(item => {
      item.id = item.id.split('-').pop();
      switch (item.attributes.model) {
        case ApiModel.RESOURCE:
          this.extendResource(item);
          break;
        case ApiModel.DATASET:
          this.extendDataset(item);
          break;
        case ApiModel.APPLICATION:
          this.extendApplication(item);
          break;
        case ApiModel.INSTITUTION:
          this.extendProvider(item);
          break;
        case ApiModel.KNOWLEDGE_BASE:
          this.extendKnowledgeBase(item);
          break;
        case ApiModel.ARTICLE:
          this.extendArticles(item);
          break;
        case ApiModel.SHOWCASE:
          this.extendShowcase(item);
          break;
        case ApiModel.NEWS:
          this.extendNews(item);
          break;
        default:
          this.extendDataset(item);
      }
    });
    return items;
  }

  /**
   * Sets url, titleTranslationKey and detailsData properties for resource item
   * @param {ISearchResult} item
   */
  private extendResource(item: ISearchResult) {
    item.url = `../../${this.routerEndpoints.DATASETS}/${item.relationships.dataset.data.id}/${this.routerEndpoints.RESOURCES}/${item.id},${item.attributes.slug}`;
    item.titleTranslationKey = 'Resources.Single';
    const isHarvested = this.isHarvested(item.attributes);
    item.detailsData = [
      {
        titleTranslationKey: isHarvested ? 'Attribute.AvailabilityDate' : 'Attribute.DataDate',
        dateFormat: isHarvested ? 'D MMMM YYYY, HH:mm' : 'D MMMM YYYY',
        data: isHarvested ? item.attributes.created : item.attributes.data_date,
        isDate: true,
      },
    ];
  }

  /**
   * Sets url, titleTranslationKey and detailsData properties for dataset item
   * @param {ISearchResult} item
   */
  private extendDataset(item: ISearchResult) {
    item.url = `../../${this.routerEndpoints.DATASETS}/${item.id},${item.attributes.slug}`;
    item.titleTranslationKey = 'Datasets.Single';
    item.detailsData = [{ titleTranslationKey: 'Attribute.UpdateDate', data: item.attributes.verified, isDate: true }];
  }

  /**
   * Sets url, titleTranslationKey, detailsData and optional author properties for application item
   * @param {ISearchResult} item
   */
  private extendApplication(item: ISearchResult) {
    item.url = `../../${this.routerEndpoints.APPLICATIONS}/${item.id},${item.attributes.slug}`;
    item.titleTranslationKey = 'Applications.Single';
    item.detailsData = [{ titleTranslationKey: 'Attribute.AvailabilityDate', data: item.attributes.created, isDate: true }];

    if (item.attributes.author) {
      item.detailsData.push({ titleTranslationKey: 'Attribute.Author', data: item.attributes.author });
    }
  }

  /**
   * Sets url, titleTranslationKey, detailsData for showcase item
   * @param {ISearchResult} item
   */
  private extendShowcase(item: ISearchResult) {
    item.url = `../../${this.routerEndpoints.SHOWCASE}/${item.id},${item.attributes.slug}`;
    item.titleTranslationKey = 'Menu.Showcases';
    item.detailsData = [{ titleTranslationKey: 'Attribute.AvailabilityDate', data: item.attributes.created, isDate: true }];
  }

  /**
   * Sets url, titleTranslationKey and detailsData properties for provider item
   * @param {ISearchResult} item
   */
  private extendProvider(item: ISearchResult) {
    item.url = `../../${this.routerEndpoints.PROVIDERS}/${item.id}, ${item.attributes.slug}`;
    item.titleTranslationKey = 'Institutions.Single';
    item.detailsData = [{ titleTranslationKey: 'Attribute.CreationDate', data: item.attributes.created, isDate: true }];
  }

  /**
   * Sets url, titleTranslationKey and detailsData properties for article item
   * @param {ISearchResult} item
   */
  private extendNews(item: ISearchResult) {
    item.url = `../../${this.routerEndpoints.ARTICLES}/${item.attributes.slug}`;
    item.titleTranslationKey = 'KnowledgeBase.News';
    item.detailsData = [{ titleTranslationKey: 'Attribute.AvailabilityDate', data: item.attributes.created, isDate: true }];
  }

  /**
   * Sets url, titleTranslationKey and detailsData properties for article item
   * @param {ISearchResult} item
   */
  private extendArticles(item: ISearchResult) {
    item.url = `../../${this.routerEndpoints.ARTICLES}/${item.id},${item.attributes.slug}`;
    item.titleTranslationKey = 'KnowledgeBase.News';
    item.detailsData = [{ titleTranslationKey: 'Attribute.AvailabilityDate', data: item.attributes.created, isDate: true }];
  }

  /**
   * Sets url, titleTranslationKey and detailsData properties for knowledge-base item
   * @param {ISearchResult} item
   */
  private extendKnowledgeBase(item: ISearchResult) {
    item.titleTranslationKey = 'KnowledgeBase.Self';
    item.detailsData = [{ titleTranslationKey: 'Attribute.AvailabilityDate', data: item.attributes.created, isDate: true }];
    item.url = `../../${this.routerEndpoints.KNOWLEDGE_BASE}/${this.routerEndpoints.USEFUL_MATERIALS}/${item.attributes.slug}/`;
  }

  /**
   * Checks if data is harvested
   * @param {ISearchResult} item
   * @return {boolean}
   */
  private isHarvested(item: ISearchResultAttributes): boolean {
    return item.source && item.source.type === 'ckan';
  }
}
