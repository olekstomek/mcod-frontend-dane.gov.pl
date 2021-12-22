import { Component, Input, OnInit } from '@angular/core';
import { Params } from '@angular/router';
import { MapParamsToTranslationKeysService } from '@app/services/map-params-to-translation-keys.service';
import { ApiModel } from '@app/services/api/api-model';

/**
 * Component which displays deafult data for the left side column
 */
@Component({
  selector: 'app-default-result-item',
  templateUrl: './default-result-item.component.html',
})
export class DefaultResultItemComponent implements OnInit {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * dataset item to display
   */
  @Input() item: any;

  /**
   * flag to indicate if notes should be displayed
   */
  @Input() showNotes = true;

  /**
   * url router link
   */
  @Input() detailsUrl: string | Array<string>;

  /**
   * query params object
   */
  @Input() queryParams: Params;

  /**
   * List of translations keys for applied filters (params)
   */
  appliedFiltersNames: string[] = [];

  /**
   * determinate if list is called from /dataset route
   */
  @Input() fromDatasetEndpoint = false;


  constructor(private mapParamsToTranslationKeysService: MapParamsToTranslationKeysService) {}

  /**
   * gets filters names if item has params
   */
  ngOnInit() {
    if (!this.queryParams) {
      return;
    }
    this.appliedFiltersNames = this.mapParamsToTranslationKeysService.getFiltersTranslations(this.queryParams);
  }
}
