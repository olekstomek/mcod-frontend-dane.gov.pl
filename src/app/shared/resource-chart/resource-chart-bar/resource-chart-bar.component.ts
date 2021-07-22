import { Component, Input, OnChanges, OnInit, SimpleChanges } from '@angular/core';
import Chart, { ChartData, ChartOptions, defaults } from 'chart.js';
import { Color, Label } from 'ng2-charts';
import { backgroundAndBorderColors, breakLongText } from '../chart-helpers';

/**
 * Resource Chart Bar Component
 */
@Component({
    selector: 'app-resource-chart-bar',
    templateUrl: './resource-chart-bar.component.html'
})
export class ResourceChartBarComponent implements OnInit, OnChanges {
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
    chartOptions: ChartOptions;

    /**
     * Initializes chart colors
     */
    ngOnInit() {
        this.chartColors = backgroundAndBorderColors;
        this.setupChartValues();
    }

    /**
     * Refresh chart data
     * @param changes
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.chartData.firstChange) {
            return;
        }
        this.setupChartValues();

    }

    /**
     * Maps nullable datasets
     * @param newDataset
     * @returns {[[Array<number>], any]}
     */
    mapNullableDatasets(newDataset: any): [[Array<number>], any] {
        // @ts-ignore
        const arr: [[Array<number>], any] = [];
        newDataset.forEach((dataset, index) => {
            arr[index] = this.mapNullableDataset(dataset, index);
        });
        return arr;
    }

    /**
     * Maps nullable dataset
     * @param newDataset
     * @param index
     * @param smallest
     * @returns {[any[], any]}
     */
    mapNullableDataset(newDataset: any, index: number): [Array<number>, any] {
        const bgs = [];
        const borders = [];
        const nullIndexes = [];
        const chartData = [];
        newDataset.data.forEach((data, i) => {
            if (data === 'null') {
                nullIndexes.push(i);
                bgs.push('rgb(255,0,0)');
                borders.push('rgb(255,0,0)');
                chartData.push(0);
            } else {
                bgs.push(backgroundAndBorderColors[index].backgroundColor);
                borders.push(backgroundAndBorderColors[index].borderColor);
                chartData.push(data);
            }
        });
        return [nullIndexes, {
            ...newDataset, data: [...chartData],
            backgroundColor: bgs,
            borderColor: borders,
            minBarLength: 10,
            hoverBackgroundColor: undefined,
            hoverBorderColor: undefined,
        }];

    }

    /**
     * Generates labels
     * @param chart
     * @returns {any[]}
     */
    generateLabels(chart: Chart): Chart.ChartLegendLabelItem[] {
        const defaultLabels = defaults.global.legend.labels.generateLabels(chart);
        const labelsWithoutSpecialCharacterColor = [];
        chart.data.datasets.map((item, index) => {
            if (Array.isArray(item.backgroundColor)) {
                const specialCharacterBgColor = 'rgb(255,0,0)';
                if (item.backgroundColor[0] === specialCharacterBgColor) {
                    let fitsNonSpecialCharacterBg;
                    for (let i = 0; !!!fitsNonSpecialCharacterBg || i < item.backgroundColor.length; i++) {
                        const bgColor = item.backgroundColor[i];
                        if (bgColor !== specialCharacterBgColor) {
                            fitsNonSpecialCharacterBg = bgColor;
                        }
                    }
                    if (!!fitsNonSpecialCharacterBg) {
                        labelsWithoutSpecialCharacterColor.push({
                            ...defaultLabels[index],
                            fillStyle: fitsNonSpecialCharacterBg
                        });
                    } else {
                        labelsWithoutSpecialCharacterColor.push({
                            ...defaultLabels[index],
                            text: 'znak umowny'
                        });
                    }
                } else {
                    labelsWithoutSpecialCharacterColor.push({
                        ...defaultLabels[index]
                    });
                }
            }
        });
        return labelsWithoutSpecialCharacterColor;
    }

    /**
     * Setups charts values
     */
    private setupChartValues() {
        const nullValues = this.mapNullableDatasets(this.chartData);
        this.chartData = nullValues.map(values => Object.assign({}, values[1]));
        this.chartOptions = {
            responsive: true,
            maintainAspectRatio: true,
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
                        if (nullValues[tooltipItem.datasetIndex][0].indexOf(tooltipItem.index) !== -1) {
                            return 'Znak umowny';
                        }
                        return data.datasets[tooltipItem.datasetIndex].data[tooltipItem.index].toLocaleString();
                    }
                }
            },
            legend: {
                display: true,
                labels: {
                    generateLabels: this.generateLabels.bind(this)
                }
            }
        };
    }
}
