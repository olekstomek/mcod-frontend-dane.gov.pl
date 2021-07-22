import { ISearchCounters } from '@app/services/models/search';

export interface IAggregationProperties {
    id: string;
    doc_count: number;
    title: string;
    titleTranslationKey?: string;
}

export enum AggregationOptionType {
    CATEGORY = 'by_category', // TODO remove with S19_DCAT_categories.fe
    CATEGORIES = 'by_categories',
    LICENSES = 'by_license_code',
    CITY = 'by_city',
    CREATED = 'by_created',
    FORMAT = 'by_format',
    INSTITUTION = 'by_institution',
    INSTITUTION_TYPE = 'by_institution_type',
    MODIFIED = 'by_modified',
    OPENNESS_SCORE = 'by_openness_score',
    TAG = 'by_tag',
    VERIFIED = 'by_verified',
    VISUALIZATION_TYPE = 'by_visualization_types',
    UPDATE_FREQUENCY = 'by_update_frequency',
    TYPES = 'by_types'
}

export enum AggregationFilterNames {
    CATEGORY = 'category', // TODO remove with S19_DCAT_categories.fe
    CATEGORIES = 'categories',
    INSTITUTION = 'institution',
    LICENSES = 'license_code',
    FORMAT = 'format',
    OPENNESS_SCORE = 'openness_score',
    VISUALIZATION_TYPE = 'visualization_types',
    UPDATE_FREQUENCY = 'update_frequency',
    TYPES = 'types',
    DATE_FROM = 'date[gte]',
    DATE_TO = 'date[lte]',
    INSTITUTION_TYPE = 'institution_type'
}

export interface IListViewFilterAggregationsOptions {
    [AggregationOptionType.CATEGORY]?: IAggregationProperties[];
    [AggregationOptionType.INSTITUTION]?: IAggregationProperties[];
    [AggregationOptionType.FORMAT]?: IAggregationProperties[];
    [AggregationOptionType.OPENNESS_SCORE]?: IAggregationProperties[];
    [AggregationOptionType.VISUALIZATION_TYPE]?: IAggregationProperties[];
    [AggregationOptionType.LICENSES]?: IAggregationProperties[];
    [AggregationOptionType.UPDATE_FREQUENCY]?: IAggregationProperties[];
    [AggregationOptionType.TYPES]?: IAggregationProperties[];
}

export interface IDatasetListViewFilterAggregationsOptions {
    [AggregationOptionType.CATEGORIES]?: IAggregationProperties[];
    [AggregationOptionType.INSTITUTION]?: IAggregationProperties[];
    [AggregationOptionType.FORMAT]?: IAggregationProperties[];
    [AggregationOptionType.OPENNESS_SCORE]?: IAggregationProperties[];
    [AggregationOptionType.VISUALIZATION_TYPE]?: IAggregationProperties[];
    [AggregationOptionType.LICENSES]?: IAggregationProperties[];
    [AggregationOptionType.UPDATE_FREQUENCY]?: IAggregationProperties[];
    [AggregationOptionType.TYPES]?: IAggregationProperties[];
}

export interface MultiselectOption {
    [key: string]: IAggregationProperties;
}

export interface DaterangeFilterUpdated {
    name: string;
    value: Date;
}

export interface DaterangeFilterModel {
    [name: string]: Date;
}

export interface FiltersToSend {
    [name: string]: string | number | Date;
}

export interface FilterName {
    [name: string]: any;
}

export type FilterModelValue = MultiselectOption & Date;

export interface FilterModel {
    [name: string]: FilterModelValue;
}

export interface DaterangeFilterAvailability {
    [name: string]: boolean;
}

export interface AvailabilityFilterMap {
    [key: string]: boolean;
}

export interface SelectedFilter {
    names: string | string [];
    key: string;
    isDate: boolean;
}
