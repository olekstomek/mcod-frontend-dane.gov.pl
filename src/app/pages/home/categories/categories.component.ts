import { Component, Input, OnInit } from '@angular/core';

/**
 * Categories Component
 */
@Component({
  selector: 'home-categories',
  templateUrl: './categories.component.html',
})
export class CategoriesComponent implements OnInit {
  /**
   * Items (categories) of categories component
   */
  @Input() items;

  /**
   * Query param name
   * @type {string}
   */
  queryParamName: string;

  /**
   * Gets query param name
   */
  ngOnInit() {
    this.queryParamName = 'categories[id][terms]';
  }

  /**
   * Gets query params
   * @param id
   */
  getQueryParam(id: string): { [key: string]: any } {
    return { [this.queryParamName]: id };
  }
}
