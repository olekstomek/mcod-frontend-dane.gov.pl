import { Component, EventEmitter, Input, Output } from '@angular/core';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import {
    FilterModel,
    DaterangeFilterUpdated,
    DaterangeFilterModel,
    FiltersToSend,
    AvailabilityFilterMap,
    DaterangeFilterAvailability,
    AggregationFilterNames,
    AggregationOptionType,
    IListViewFilterAggregationsOptions,
    IAggregationProperties
} from '@app/services/models/filters';
import { ListViewManageFiltersService } from '@app/services/filters/list-view-manage-filters.service';
import { DatasetCategoriesHelper } from '@app/pages/dataset/dataset-categories-helper.service';

/**
 * Abstract Component for List View filters
 */
@Component({ template: '' })
export class ListViewFilterAbstractComponent {
    /**
     * All available Names for Filters
     */
    readonly FiletersNames = AggregationFilterNames;

    /**
     * All available Names for Options
     */
    readonly OptionsNames = AggregationOptionType;

    /**
     * selected Options
     */
    selectedData: FilterModel;

    /**
     * map for each filter, determines if option selection has changed
     */
    availabilityFilterMap: AvailabilityFilterMap;

    /**
     * filter options
     */
    @Input() filtersOptions: IListViewFilterAggregationsOptions;

    /**
     * original data before all changes, neede to determine if filter has changed
     */
    @Input() originalSelectedData: FilterModel;

    /**
     * max length of search input
     */
    @Input() maxLength: number;

    /**
     * sets selected filters and builds availability model for tracking changes inside filters
     * @param {FilterModel} dataModel
     */
    @Input() set data(dataModel: FilterModel) {
        this.selectedData = dataModel;
        this.availabilityFilterMap = this.manageFiltersService.buildAvailibilityMap(Object.keys(this.selectedData));
    }

    /**
     * apply filter event
     */
    @Output() applyFilters = new EventEmitter<any>();

    constructor(protected manageFiltersService: ListViewManageFiltersService,
                readonly categoriesHelper: DatasetCategoriesHelper) {
    }

    /**
     * updates selected filters data and availability map for multiselect filter after change has been made
     * @param {string} name
     * @param {IAggregationProperties} selectedOption
     */
    onSelectedChange(name: string, selectedOption: IAggregationProperties) {
        this.selectedData[name] = this.manageFiltersService.changeMultiselectFilter(this.selectedData[name], selectedOption) as any;
        const shouldEnable: boolean = this.manageFiltersService.checkIfMultiselectChanged(this.selectedData[name],
            this.originalSelectedData[name]);

        this.availabilityFilterMap = { ...this.availabilityFilterMap, ...{ [name]: shouldEnable } };
    }

    /**
     * updates selected filters data and availability map for daterange filter after change has been made
     * @param {DaterangeFilterUpdated []} data
     */
    onDaterangeChange(data: DaterangeFilterUpdated []) {
        const newDaterange: DaterangeFilterModel = this.manageFiltersService.changeDaterangeFilter(data);
        this.selectedData = Object.assign(this.selectedData, newDaterange);
        const newDaterangeAvailibility: DaterangeFilterAvailability = this.manageFiltersService.getDaterangeAvailability(data,
            newDaterange, this.originalSelectedData);

        this.availabilityFilterMap = { ...this.availabilityFilterMap, ...newDaterangeAvailibility };
    }

    /**
     * prepares selected data and sends by applyFilters event
     * @param {string []} filterNames names to send
     */
    protected applyFilter(filterNames: string []) {
        const data: FiltersToSend = this.manageFiltersService.prepareToApply(filterNames, this.selectedData);
        this.applyFilters.emit(data);
    }
}
