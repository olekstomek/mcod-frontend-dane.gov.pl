import { Injectable } from '@angular/core';

import { FeatureFlagService } from '@app/services/feature-flag.service';
import { AggregationFilterNames, AggregationOptionType } from '@app/services/models/filters';

// TODO remove with S19_DCAT_categories.fe
/**
 * Categories Helper
 */
@Injectable({providedIn: 'root'})
export class DatasetCategoriesHelper {
    /**
     * Determines if filters should use categories
     * @type {boolean}
     */
    readonly isCategories: boolean;

    /**
     * @ignore
     */
    constructor(private readonly featureFlagService: FeatureFlagService) {
        this.isCategories = this.featureFlagService.validateFlagSync('S19_DCAT_categories.fe');

    }

    /**
     * Gets option name
     * @returns {AggregationOptionType.CATEGORIES | AggregationOptionType.CATEGORY}
     */
    getOptionName(): AggregationOptionType.CATEGORIES | AggregationOptionType.CATEGORY {
        return this.isCategories ? AggregationOptionType.CATEGORIES : AggregationOptionType.CATEGORY;
    }

    /**
     * Gets filter name
     * @returns {AggregationFilterNames.CATEGORIES | AggregationFilterNames.CATEGORY}
     */
    getFilterName(): AggregationFilterNames.CATEGORIES | AggregationFilterNames.CATEGORY {
        return this.isCategories ? AggregationFilterNames.CATEGORIES : AggregationFilterNames.CATEGORY;
    }

    /**
     * Gets query param name
     * @returns {string}
     */
    getQueryParamName(): string {
        return `${this.isCategories ? 'categories' : 'category'}[id][terms]`;
    }
}
