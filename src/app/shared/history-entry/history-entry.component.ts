import { Component, Input, OnInit } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

/**
 * History Entry component stands behind logic for interpreting backend historical items
 * @example
 * <app-history-entry item="${item}"></app-history-entry/>
 */
@Component({
  selector: 'app-history-entry',
  templateUrl: './history-entry.component.html',
})
export class HistoryEntryComponent implements OnInit {
  /**
   * item attributes
   */
  @Input() item: any;
  link: string;
  title: string;

  /**
   * @ignore
   */
  constructor(private translateService: TranslateService) {}

  /**
   * Translate action and table name, format variables according to entry data and pass them to template
   */
  ngOnInit() {
    const change = this.item.attributes.new_value;
    const entry = this.item.attributes.table_name;
    const id = this.item.attributes.row_id;
    const slug = change && change.slug ? ',' + change.slug : '';
    this.title = change && change.title ? change.title : change && change.name ? change.name : '';
    const currentLang = this.translateService.currentLang;

    switch (entry) {
      case 'resource':
        this.link = change && `/dataset/${change.dataset_id}/resource/${id}`;
        break;
      case 'organization':
        this.link = change && `/institution/${id + slug}`;
        break;
      case 'application_dataset':
        this.link = change && `/application/${change.application_id}?dataset=${change.dataset_id}`;
        break;
      case 'user':
        this.link = '';
        this.title = change && change.email;
        break;
      default:
        this.link = `/${entry}/${id + slug}`;
        break;
    }
    if (entry.indexOf('tag') !== -1 && change) {
      this.link = `/dataset/${change.dataset_id}`;
    }
    this.link = currentLang + this.link;
  }
}
