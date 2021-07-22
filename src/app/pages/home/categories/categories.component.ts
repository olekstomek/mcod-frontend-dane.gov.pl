import { Component, Input, OnInit } from '@angular/core';
import { DatasetCategoriesHelper } from '@app/pages/dataset/dataset-categories-helper.service';

/**
 * Categories Component
 */
@Component({
    selector: 'home-categories',
    templateUrl: './categories.component.html'
})
export class CategoriesComponent implements OnInit {

    /**
     * Items (categories) of categories component
     */
    @Input() items;

    /**
     * Query param name
     * @type {string}
     */
    queryParamName: string;

    /**
     * @ignore
     */
    constructor(private readonly categoriesHelper: DatasetCategoriesHelper) {
    }

    /**
     * Gets query param name
     */
    ngOnInit() {
        this.queryParamName = this.categoriesHelper.getQueryParamName();
    }

    /**
     * Gets query params
     * @param id
     */
    getQueryParam(id: string): { [key: string]: any } {
        return {[this.queryParamName]: id};
    }
}
