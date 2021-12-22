import { AggregationFilterNames, MultiselectOption } from '@app/services/models/filters';

export interface IListViewApplicationsFiltersModel {
  [AggregationFilterNames.CATEGORIES]: MultiselectOption;
  [AggregationFilterNames.APPLICATIONS_TYPE]: MultiselectOption;
  [AggregationFilterNames.PLATFORM_TYPE]: MultiselectOption;
}

export const ApplicationsListViewFilterNames = [
  AggregationFilterNames.CATEGORIES,
  AggregationFilterNames.APPLICATIONS_TYPE,
  AggregationFilterNames.PLATFORM_TYPE,
];
