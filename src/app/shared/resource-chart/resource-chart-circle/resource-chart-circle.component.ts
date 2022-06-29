import { ChangeDetectorRef, Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import { ChartData, ChartOptions, ChartType } from 'chart.js';
import { Color, Label } from 'ng2-charts';

import { breakLongText, transparentColors } from '../chart-helpers';

@Component({
  selector: 'app-resource-chart-circle',
  templateUrl: './resource-chart-circle.component.html',
})
export class ResourceChartCircleComponent implements OnChanges, OnInit {
  /**
   * Chart type - donought, pie, polarArea
   */
  @Input('type') chartType: ChartType;

  /**
   * Chart labels - one line text
   */
  @Input('labels') chartLabels: Label[];

  /**
   * Full labels - multiline tooltips
   */
  @Input('fullLabels') chartFullLabels: string[];

  /**
   * Chart data
   */
  @Input('datasets') chartData: ChartData[];

  /**
   * Bar background and border colors
   */
  chartColors: Color[];

  /**
   * Determines if label has been already created
   * workaround for chart.js bug
   * @type {boolean}
   */
  isLabelAlreadyCreated: boolean;

  /**
   * Chart options.
   * Tooltip options - formatted multiline text
   */
  chartOptions: ChartOptions = {
    responsive: true,
    maintainAspectRatio: false,
    tooltips: {
      position: 'nearest', // auto position tooltip
      callbacks: {
        title: (tooltipItem, data) => {
          let title = data['labels'][tooltipItem[0]['index']] as string | string[];

          if (this.chartFullLabels && this.chartFullLabels.length) {
            const fullTitle = this.chartFullLabels[tooltipItem[0]['index']];

            if (fullTitle) {
              title = breakLongText(fullTitle);
            }
          }
          this.isLabelAlreadyCreated = false;
          return title;
        },
        label: (tooltipItem, data) => {
          if (this.isLabelAlreadyCreated) {
            return null;
          }
          this.isLabelAlreadyCreated = true;
          return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString();
        },
      },
    },
    legend: {
      position: 'bottom',
    },
  };

  /**
   * @ignore
   */
  constructor(private changeDetection: ChangeDetectorRef) {}

  /**
   * Updates labels and data
   */
  ngOnChanges(changes: SimpleChanges): void {
    if (!changes['chartData'] || !changes['chartLabels']) {
      return;
    }

    const tempDatasets = [...changes['chartData'].currentValue];
    this.chartData = tempDatasets[0]['data'];

    if (changes['chartType']) {
      this.chartType = 'radar'; // correct, but not used - forces change detection to run
      this.changeDetection.detectChanges();
      this.chartType = changes['chartType'].currentValue;
    }
  }

  /**
   * Initializes chart colors
   */
  ngOnInit(): void {
    let colorList = [...transparentColors];

    if (this.chartData && this.chartData.length) {
      colorList[this.chartData.length - 1] = transparentColors[transparentColors.length - 1];
    }

    this.chartColors = [
      {
        backgroundColor: colorList,
        borderColor: '#fff',
      },
    ];
  }
}
