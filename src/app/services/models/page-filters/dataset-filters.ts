import { AggregationFilterNames, MultiselectOption } from '@app/services/models/filters';

export interface IListViewDatasetFiltersModel {
    [AggregationFilterNames.CATEGORIES]: MultiselectOption;
    [AggregationFilterNames.INSTITUTION]: MultiselectOption;
    [AggregationFilterNames.FORMAT]: MultiselectOption;
    [AggregationFilterNames.OPENNESS_SCORE]: MultiselectOption;
    [AggregationFilterNames.VISUALIZATION_TYPE]: MultiselectOption;
    [AggregationFilterNames.TYPES]: MultiselectOption;
    [AggregationFilterNames.DATE_FROM]: Date;
    [AggregationFilterNames.DATE_TO]: Date;
}

export interface IListViewDatasetCategoryFiltersModel {
    [AggregationFilterNames.CATEGORY]: MultiselectOption;
    [AggregationFilterNames.INSTITUTION]: MultiselectOption;
    [AggregationFilterNames.FORMAT]: MultiselectOption;
    [AggregationFilterNames.OPENNESS_SCORE]: MultiselectOption;
    [AggregationFilterNames.VISUALIZATION_TYPE]: MultiselectOption;
    [AggregationFilterNames.TYPES]: MultiselectOption;
    [AggregationFilterNames.DATE_FROM]: Date;
    [AggregationFilterNames.DATE_TO]: Date;
}

export const DatasetListViewFilterNames = [
    AggregationFilterNames.CATEGORY,
    AggregationFilterNames.CATEGORIES,
    AggregationFilterNames.INSTITUTION,
    AggregationFilterNames.FORMAT,
    AggregationFilterNames.OPENNESS_SCORE,
    AggregationFilterNames.VISUALIZATION_TYPE,
    AggregationFilterNames.TYPES,
    AggregationFilterNames.DATE_FROM,
    AggregationFilterNames.DATE_TO
];
