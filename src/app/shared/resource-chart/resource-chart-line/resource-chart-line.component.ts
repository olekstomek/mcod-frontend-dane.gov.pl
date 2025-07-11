import { Component, Input, OnInit } from '@angular/core';
import { ChartData, ChartOptions } from 'chart.js';
import { Label, Color } from 'ng2-charts';

import { backgroundAndBorderColors, breakLongText } from '../chart-helpers';

/**
 * Resource Chart Line Component
 */
@Component({
  selector: 'app-resource-chart-line',
  templateUrl: './resource-chart-line.component.html',
})
export class ResourceChartLineComponent implements OnInit {
  /**
   * Chart labels
   */
  @Input('labels') chartLabels: Label[];

  /**
   * Chart data
   */
  @Input('datasets') chartData: ChartData[];

  /**
   * Background and border colors
   */
  chartColors: Color[];

  /**
   * Chart options.
   * Tooltip options - formatted multiline text
   */
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      position: 'nearest',
      callbacks: {
        title: (tooltipItem, data) => {
          let title = data['labels'][tooltipItem[0]['index']] as string | string[];
          const datasetIndex = tooltipItem[0].datasetIndex;
          const fullDataLabels = data.datasets[datasetIndex]['fullDataLabels'];

          if (fullDataLabels) {
            const fullTitle = fullDataLabels[tooltipItem[0]['index']];

            if (fullTitle) {
              title = breakLongText(fullTitle);
            }
          }

          return title;
        },
        label: function (tooltipItem, data) {
          return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString();
        },
      },
    },
  };

  /**
   * Initializes chart colors
   */
  ngOnInit(): void {
    this.chartColors = backgroundAndBorderColors;
  }
}
