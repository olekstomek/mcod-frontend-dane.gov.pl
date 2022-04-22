import { Component, Input, OnInit } from '@angular/core';
import { ResultItemDetailsData } from '@app/services/models/result-item-details';

/**
 * TODO Create abstract component or interface for result item
 * Component which displays additional data on the right column of list view
 */
@Component({
  selector: 'app-details-result-item',
  templateUrl: './details-result-item.component.html',
})
export class DetailsResultItemComponent implements OnInit {
  /**
   * icon name based on category
   */
  categoryIcon: string;

  iconName: string;

  /**
   * array with data which will be displayed
   */
  @Input() detailsData: ResultItemDetailsData[];

  /**
   * showcase category name to display
   */
  @Input() showcaseCategoryName: string;

  /**
   * showcase category key
   */
  @Input() showcaseCategoryKey: string;

  /**
   * key to translation
   */
  @Input() titleTranslationKey: string;

  /**
   * enable/disable displaying each detail {key: value} in one row
   */
  @Input() showEachDetailInRow = false;

  /**
   * check if is showcases view
   */
  @Input() isShowcaseView = false;

  /**
   * check if is search and showcase view
   */
  @Input() isSearchShowcaseView = false;

  /**
   * check if is dataset view
   */
  @Input() isDatasetView = false;

  ngOnInit() {
    switch (this.showcaseCategoryKey) {
      case 'app':
        this.categoryIcon = 'ic-aplikacje';
        break;
      case 'www':
        this.categoryIcon = 'ic-portal-www';
        break;
      case 'other':
        this.categoryIcon = 'ic-inne';
        break;
    }

    switch (this.titleTranslationKey) {
      case 'Datasets.Single':
        this.iconName = 'dataset';
        break;
      case 'Resources.Single':
        this.iconName = 'resource';
        break;
    }
  }
}
