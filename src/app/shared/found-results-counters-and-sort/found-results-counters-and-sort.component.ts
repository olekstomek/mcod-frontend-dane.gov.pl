import { Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { Params } from '@angular/router';
import { PageParams } from '@app/services/models/page-params';

interface IComponentOptions {
    label: string;
    count: string;
    value?: string;
    url?: string;
    param?: Params;
}

/**
 * The component that display search results counters and sort dropdown.
 * Example of usage:
 * <app-found-results-counters-and-sort
 *                [selected]="selectedOption"
 *                (update)="cb($event)"
 *                [counters]="[
 *                {label: 'labelName' | translate, value: count, url: "/", param: {paramForRouter: paramValue}}
 *                ]"
 *                [searchOptions]="[
 *                {label:'option' | translate, value: 'relevance'},
 *                ]">
 * </app-found-results-counters-and-sort>
 */
@Component({
    selector: 'app-found-results-counters-and-sort',
    templateUrl: './found-results-counters-and-sort.component.html'
})
export class FoundResultsCountersAndSortComponent implements OnChanges {

    /**
     * Selected item on sort dropdown
     */
    @Input() selected: string;

    /**
     * selected model
     */

    @Input() selectedModel: string;

    /**
     * Sort options
     */
    @Input() sortOptions: IComponentOptions[];

    /**
     * Counters to display
     */
    @Input() counters: IComponentOptions[];

    /**
     * Tooltip text
     * @type {string}
     */
    @Input() tooltipText: string;

    /**
     * Tooltip title
     * @type {string}
     */
    @Input()
    tooltipTitle: string;

    /**
     * Update param event emitter
     */
    @Output() update: EventEmitter<PageParams> = new EventEmitter;

    /**
     * Determines whether sort value is valid
     */
    isSortValid: boolean;

    /**
     * Emits new params
     * @param {Params} params
     * @param {boolean} isFoundParam
     */
    updateParams(params: PageParams, isFoundParam = false) {
        const isSameFoundParamSelected = isFoundParam && params['model[terms]'] === this.selectedModel;
        if (!isSameFoundParamSelected) {
            this.update.emit(params);
        }
    }

    /**
     * Determines whether provided sort value exists on the list of sort options.
     * Filters out counters with '0' value
     * @param {SimpleChanges} changes 
     */
    ngOnChanges(changes: SimpleChanges) {
        if (changes.selected) {
            this.isSortValid = !!this.sortOptions.find(option => option.value === changes.selected.currentValue)
        }

        if (changes.counters && changes.counters.currentValue instanceof Array) {
            this.counters = changes.counters.currentValue.filter((counter: IComponentOptions) => !!counter['count']) as IComponentOptions[];
        }
    }
}
