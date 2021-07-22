import { AggregationFilterNames, MultiselectOption } from '@app/services/models/filters';

export interface IListViewInstitutionItemFiltersModel {
    [AggregationFilterNames.CATEGORIES]: MultiselectOption;
    [AggregationFilterNames.FORMAT]: MultiselectOption;
    [AggregationFilterNames.OPENNESS_SCORE]: MultiselectOption;
    [AggregationFilterNames.VISUALIZATION_TYPE]: MultiselectOption;
    [AggregationFilterNames.TYPES]: MultiselectOption;
    [AggregationFilterNames.DATE_FROM]: Date;
    [AggregationFilterNames.DATE_TO]: Date;

}
export interface IListViewInstitutionItemCategoryFiltersModel {
    [AggregationFilterNames.CATEGORY]: MultiselectOption;
    [AggregationFilterNames.FORMAT]: MultiselectOption;
    [AggregationFilterNames.OPENNESS_SCORE]: MultiselectOption;
    [AggregationFilterNames.VISUALIZATION_TYPE]: MultiselectOption;
    [AggregationFilterNames.TYPES]: MultiselectOption;
    [AggregationFilterNames.DATE_FROM]: Date;
    [AggregationFilterNames.DATE_TO]: Date;

}

export const InstitutionItemListViewFilterNames = [
    AggregationFilterNames.CATEGORY,
    AggregationFilterNames.CATEGORIES,
    AggregationFilterNames.FORMAT,
    AggregationFilterNames.OPENNESS_SCORE,
    AggregationFilterNames.VISUALIZATION_TYPE,
    AggregationFilterNames.TYPES,
    AggregationFilterNames.DATE_FROM,
    AggregationFilterNames.DATE_TO
];
