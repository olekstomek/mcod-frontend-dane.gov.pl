import { Component, OnInit } from '@angular/core';

import { ApplicationsService } from '@app/services/applications.service';
import { NotificationsService } from '@app/services/notifications.service';

/**
 * Followed Application Component
 */
@Component({
    selector: 'app-followed-application',
    templateUrl: './followed-application.component.html'
})
export class FollowedApplicationComponent implements OnInit {
    /**
     * Default params of followed application component
     */
    params: any = {
        per_page: 5,
        page: 1,
        sort: '-modified'
    };

    /**
     * Array of items (followed applications)
     */
    items: any[];

    /**
     * Count of items (followed applications)
     */
    count: number;

    /**
     * @ignore
     */
    constructor(private applicationsService: ApplicationsService,
                private notificationsService: NotificationsService) {
    }

    /**
     * Initializes list of items (applications) on component init
     */
    ngOnInit() {
        this.initItems();
    }

    /**
     * Initializes list of items (applications)
     */
    initItems() {
        this.applicationsService.getFollowed(this.params)
            .subscribe(data => {
                this.items = data.data;
                this.count = data.meta.count;
            });
    }

    /**
     * Stop following changes of dataset with given id
     * Only logged in users
     * @param {string} id
     * @returns {Observable<any>}
     */
    unfollowItem(item) {
        this.applicationsService.unfollowOne(item.id)
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
     * Updates query params and items (applications) on every user interaction
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
