import { toggleVertically } from '@app/animations';
import { Component, ElementRef, Input, OnChanges, OnInit, SimpleChanges, ViewChild } from '@angular/core';

import { Column } from './types';
import { Compare, Sorter } from '@app/shared/helpers';

/**
 * Datagrid table component for displaying resources data
 */
@Component({
    selector: 'app-datagrid',
    templateUrl: './datagrid.component.html',
    animations: [
        toggleVertically
    ]
})
export class DatagridComponent implements OnInit, OnChanges {
    @Input() columns: Array<Column>;
    @Input() rows: Array<any>;
    @Input() summary: string = '';
    sorter: Sorter;
    searchTerm: string;
    searchKeys: string[];
    currentPage = 1;
    perPage = 5;
    filtersCollapsed: boolean = true;
    collapseTable: boolean;

    filters: any[];
    hoveredRowIndex = -1;
    focusedCell = -1;
    @ViewChild('datagrid') datagrid: ElementRef;

    private results: Array<any>;

    /**
     * Instantiate sorter and filters
     */
    constructor(
    ) {
        this.sorter = new Sorter();
        this.filters = [];
    }

    /**
     *  Adds one empty filter by default
     */
    ngOnInit(): void {
        !this.filters.length && this.filters.push({key: null, phrase: ''});
    }

    /**
     * On view update (frontend gets response from backend and \@Input variables are updated)
     * add column names to search keys and set default sorting on Lp.
     * @param {SimpleChanges} changes
     */
    ngOnChanges(changes: SimpleChanges): void {
        this.searchKeys = [];
        this.columns.forEach(value => {
            this.searchKeys.push(value.name);
        });
        if (this.searchKeys.indexOf('Lp.') !== -1) {
            this.sorter.sort('Lp.', this.rows);
        }
    }


    /**
     * Set sort function, reset pagination
     * @param key
     * @param preserveDirection
     * @default
     */
    sort(key, preserveDirection = false) {
        this.currentPage = 1;
        this.sorter.sort(key, this.rows, preserveDirection);
    }

    /**
     * Create rows backup if non existent, and filter out rows based on current filter options
     */
    filterItems() {
        this.currentPage = 1;

        if (!this.results) {
            this.results = this.rows.concat();
        }

        this.rows = this.results.concat();
        this.filters.forEach(filter => {
            if (!!filter.key && filter.key !== 'null') {
                this.rows = this.rows.filter(item => {
                    return !!filter.key && item[filter.key] && Compare.comparisonFilter(item[filter.key], filter.phrase);
                });
            }
        });
        
        if(this.sorter.key) {
            this.sort(this.sorter.key, true);
        }
    }

    /**
     * Template view function only. Translates Sorter direction to Human readable format
     * @param {number} direction
     * @returns {string}
     */
    sortDirectionToString(direction: number): string {
        return (direction && direction > 0) ? 'Ascending' : 'Descending';
    }

    /**
     * View mouse leave event, clears focus
     */
    onMouseLeave() {
        if (!this.focusedCell)
            this.hoveredRowIndex = -1;
    }

    /**
     * Movement inside tbody via keyboard's arrows
     */
    onKeyDown(event) {
        (event.key === 'ArrowUp') && (this.hoveredRowIndex - 1 > -1) && (this.hoveredRowIndex -= 1);
        (event.key === 'ArrowDown') && (this.hoveredRowIndex + 1 < this.perPage) && (this.hoveredRowIndex += 1);
        (event.key === 'ArrowRight') && (this.focusedCell + 1 < this.columns.length) && (this.focusedCell += 1);
        (event.key === 'ArrowLeft') && (this.focusedCell - 1 > -1) && (this.focusedCell -= 1);

        (this.hoveredRowIndex > -1) && (this.focusedCell > -1) && this.setFocus();
    }

    /**
     * Sets cell focus using arrow keys
     */
    setFocus() {
        const row = this.datagrid.nativeElement.querySelectorAll('tbody tr')[this.hoveredRowIndex];
        const cell = row.querySelectorAll('td')[this.focusedCell];

        cell.focus();
    }

    /**
     * Sets cell focus using mouse
     * @param rowIndex
     * @param cellIndex
     */
    onFocus(rowIndex, cellIndex) {
        this.hoveredRowIndex = rowIndex;
        this.focusedCell = cellIndex;
    }
}
