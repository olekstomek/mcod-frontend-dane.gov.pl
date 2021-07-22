import { Component, SimpleChanges, OnChanges, Input } from '@angular/core';
import { ChartOptions, ChartDataSets } from 'chart.js';
import { Label, Color  } from 'ng2-charts';

import { backgroundAndBorderColors } from '../chart-helpers';

/**
 * Resource Chart Scatter Component
 */
@Component({
    selector: 'app-resource-chart-scatter',
    templateUrl: './resource-chart-scatter.component.html'
})
export class ResourceChartScatterComponent implements OnChanges {     

    /**
     * Chart labels
     */
    @Input('labels') chartLabels: Label[];

    /**
     * Chart data
     */
    @Input('datasets') chartData: ChartDataSets[];

    /**
     * Background and border colors
     */
    chartColors: Color[];

    /**
     * Chart options
     */
    chartOptions: ChartOptions = {
        responsive: true,
        maintainAspectRatio: false
    };

    /**
     * Updates and transforms data into 2-dimensional structure
     */
    ngOnChanges(changes: SimpleChanges) {
        if (!changes['chartData'] || !changes['chartLabels']) {
            return;
        }

        const labels = [...changes['chartLabels'].currentValue];
        const datasets = [...changes['chartData'].currentValue];

        const chartData = datasets.map((dataset, datasetIndex) => {
            const dataRow = dataset['data'].map((item, itemIndex) => {
                return({
                    x: labels[itemIndex], 
                    y: item
                });
            });

            return ({
                data: dataRow,
                label: dataset['label'],
                pointRadius: (datasetIndex * 2) + 5,
            });
        });

        this.chartData = [...chartData];
    }

    /**
     * Initializes chart colors
     */
    ngOnInit(): void {
        this.chartColors = backgroundAndBorderColors;
    }
}
