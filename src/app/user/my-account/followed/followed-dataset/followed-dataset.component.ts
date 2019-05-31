import { Component, OnInit } from '@angular/core';

import { NotificationsService } from '@app/services/notifications.service';
import { DatasetService } from '@app/services/dataset.service';

/**
 * Followed Dataset Component
 */
@Component({
    selector: 'app-followed-dataset',
    templateUrl: './followed-dataset.component.html'
})
export class FollowedDatasetComponent implements OnInit {
    /**
     * Default params of followed dataset component
     */
    params: any = {
        per_page: 5,
        page: 1,
        sort: '-modified'
    };

    /**
     * Array of items (followed datasets)
     */
    items: any[];

    /**
     * Count of items (followed datasets)
     */
    count: number;

    /**
     * @ignore
     */
    constructor(private datasetService: DatasetService,
                private notificationsService: NotificationsService) { 
    }
    
    /**
     * Initializes list of items (applications) on component init
     */
    ngOnInit() {
        this.initItems();
    }

    /**
     * Initializes list of items (datasets)
     */
    initItems() {
        this.datasetService.getFollowed(this.params)
            .subscribe(data => {
                this.items = data.data;
                this.count = data.meta.count;
            });
    }

    /**
     * Stop following changes of specfied item (dataset)
     * @param {any} item
     */
    unfollowItem(item) {
        this.datasetService.unfollowOne(item.id)
            .subscribe(() => {
                setTimeout( () => {
                    this.initItems();
                }, 1000);
            }, error => {
                if (error.message) {
                    this.notificationsService.addError(error.message);
                }
            });
    }

    /**
     * Updates query params and items (datasets) on every user interaction
     * @param {any} params 
     */
    updateParams(params: any) {
        this.params = Object.assign(this.params, params);
        this.initItems();
    }

    /**
     * Tracks list of items by single item id to prevent re-rendering of existing elements in the template
     * @param index 
     * @param item 
     * @returns id 
     */
    trackById(index, item) {
        return item.id;
    }
}
