import { Component, ElementRef, Input, OnInit, ViewChild, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { switchMap, withLatestFrom, distinctUntilChanged } from 'rxjs/operators';
import { of, Subscription } from 'rxjs';

import { toggleVertically } from '@app/animations';
import { DatasetService } from '@app/services/dataset.service';
import { DefaultListViewParams } from '../resource-table/DefaultListViewParams';
import { ResourceTableColumn } from '../resource-table/ResourceTableColumn';
import { ResourceHelper } from '../helpers/resource.helper';
import { ActivatedRouteHelper } from '../helpers/activated-route.helper';

/**
 * Resource Table No Filters Component
 */
@Component({
    selector: "app-resource-table-no-filters",
    templateUrl: "./resource-table-no-filters.component.html",
    animations: [
        toggleVertically
    ]
})
export class ResourceTableNoFiltersComponent implements OnInit, OnDestroy {

    /**
     * Resource filter subscription 
     */
    resourceFilterSubscription: Subscription;

    /**
    * Incoming resource ID
    */
    @Input() resourceId: string;

    /**
     * Table columns
     */
    columns: ResourceTableColumn[];

    /**
     * Items - table rows with data
     */
    items: any[];

    /**
     * Total count of all rows stored in the database
     */
    count: number;

    /**
     * Max rows of data API returns
     */
    countLimit = 10000;

    /**
     * Determines whether amount of data available exceeds its limit
     */
    isLimitExceeded = false;

    /**
     * Determines whether table view exists
     */
    hasTableView = true;

    /**
     * Default params of the component
     */
    basicParams: DefaultListViewParams = {
        page: 1,
        per_page: 20,
        q: '',
        sort: ''
    };

    /**
     * Page settings based on basic params and user interactions
     */
    params: DefaultListViewParams;

    /**
     * Reference to the table in the template
     */
    @ViewChild('resourceTable') resourceTableRef: ElementRef;

    /**
     * Determines hovered row index number
     */
    hoveredRowIndex = -1;

    /**
     * Determines focused cell index number
     */
    focusedCell = -1;
    
    /**
     * Determines whether table width is full or limited to parent
     */
    isTableFullWidth = false;

    /**
     * @ignore
     */
    constructor(
        private datasetService: DatasetService,
        private router: Router,
        private activatedRoute: ActivatedRoute) {
    }

    /**
     * Initializes and updates table data on every queryParam and resource filter change.
     */
    ngOnInit() {
        if (!this.resourceId) {
            this.resourceId = ActivatedRouteHelper.getParamFromCurrentOrParentRoute(this.activatedRoute, 'resourceId');
        }
        
        this.params = {...this.basicParams};
        
        const filter$ = this.datasetService.resourceFilterChanged$.pipe(
            distinctUntilChanged()
        );

        this.resourceFilterSubscription = filter$.subscribe(filterQuery => {
            this.updateParams({page: 1, q: filterQuery});
        });

        this.activatedRoute.queryParamMap.pipe(
            withLatestFrom(filter$),
            switchMap(([qParamMap, filterQuery]) => {
                const params = {
                    page: +qParamMap.get('page') || this.basicParams['page'],
                    per_page: +qParamMap.get('per_page') || this.basicParams['per_page'],
                    q: qParamMap.get('q') || '',
                    sort: qParamMap.get('sort') || ''
                };

                return this.datasetService.getResourceData(this.resourceId, {
                    ...params,
                    q: filterQuery
                });
            })
        )
        .subscribe(response => {
            if (!response['meta']['headers_map']) {
                this.hasTableView = false;
                return;
            };

            if (!response['data'].length) {
                this.items = null;
                this.count = (this.params && !!this.params.q) ? 0 : null;
                return;
            };

            this.columns = ResourceHelper.getTableColumns(response);
            this.items = response['data'].map(item => item['attributes']);
            this.count = response['meta']['count'];            
        })
    }

    /**
     * Updates query params on every user interaction
     * @param {any} params
     */
    updateParams(params: any) {
        if (!('page' in params)) {
            params['page'] = 1;
        }

        this.params = {
            ...this.params,
            ...params
        };
        this.router.navigate([], {queryParams: this.params, replaceUrl: true});
    }

    /**
     * Sorts data by specified column
     * @param {string} name 
     */
    sortByColumn(name: string) {
        const params = {sort: name};

        if ('sort' in this.params) {

            // the same column
            if (this.params['sort'].indexOf(name) !== -1) {
                params.sort = this.params['sort'].startsWith('-', 0) ? name : `-${name}`;
            }
        }

        this.updateParams(params);
    }

    /**
     * View mouse leave event, clears focus
     */
    onMouseLeave() {
        if (!this.focusedCell) {
            this.hoveredRowIndex = -1;
        }
    }

    /**
     * Movement inside tbody via keyboard's arrows
     * @param {KeyboardEvent} event
     */
    onKeyDown(event: KeyboardEvent) {
        (event.key === 'ArrowUp') && (this.hoveredRowIndex - 1 > -1) && (this.hoveredRowIndex -= 1);
        (event.key === 'ArrowDown') && (this.hoveredRowIndex + 1 < this.params.per_page) && (this.hoveredRowIndex += 1);
        (event.key === 'ArrowRight') && (this.focusedCell + 1 < this.columns.length) && (this.focusedCell += 1);
        (event.key === 'ArrowLeft') && (this.focusedCell - 1 > -1) && (this.focusedCell -= 1);

        (this.hoveredRowIndex > -1) && (this.focusedCell > -1) && this.setFocus();
    }

    /**
     * Sets cell focus using arrow keys
     */
    setFocus() {
        const row = this.resourceTableRef.nativeElement.querySelectorAll('tbody tr')[this.hoveredRowIndex];
        const cell = row.querySelectorAll('td')[this.focusedCell];

        cell.focus();
    }

    /**
     * Sets cell focus using mouse
     * @param {number} rowIndex
     * @param {number} cellIndex
     */
    onFocus(rowIndex: number, cellIndex: number) {
        this.hoveredRowIndex = rowIndex;
        this.focusedCell = cellIndex;
    }

    /**
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy(): void {
        this.resourceFilterSubscription && this.resourceFilterSubscription.unsubscribe();
    }
}
