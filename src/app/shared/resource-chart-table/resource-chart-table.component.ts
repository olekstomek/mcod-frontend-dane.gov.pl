import { Component, Input, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

import { toggleVertically } from '@app/animations/toggle-vertically';
import { ActivatedRouteHelper } from '../helpers/activated-route.helper';
import { DatasetService } from '@app/services/dataset.service';

/**
 * Resource Chart Table Component
 */
@Component({
  selector: 'app-resource-chart-table',
  templateUrl: './resource-chart-table.component.html',
  animations: [toggleVertically],
})
export class ResourceChartTableComponent implements OnInit {
  @Input() summaryTranslationKey: string;

  /**
   * Is table visible by default
   */
  @Input() isTableVisible = false;

  /**
   * Short version or default labels
   */
  @Input('chartLabels') shortLabels: string[];

  /**
   * Full version of labels
   */
  @Input() fullLabels: string[];

  /**
   * Table data
   */
  @Input('chartDatasets') tableData: any;

  /**
   * Main table header
   */
  @Input('xAxisLabel') mainTableHeader: string;

  /**
   * Related resource id
   */
  resourceId: string;

  /**
   * Related resource title
   */
  resourceTitle: string;

  /**
   * @ignore
   */
  constructor(private datasetService: DatasetService, private activatedRoute: ActivatedRoute) {}

  /**
   * Gets related resource title
   */
  ngOnInit(): void {
    this.resourceId = ActivatedRouteHelper.getParamFromCurrentOrParentRoute(this.activatedRoute, 'resourceId');
    this.datasetService.getResourceById(this.resourceId).subscribe(response => {
      this.resourceTitle = response.attributes.title;
    });
  }
}
