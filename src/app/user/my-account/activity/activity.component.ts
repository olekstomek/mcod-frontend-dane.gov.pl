import { Component, OnInit } from '@angular/core';
import * as _ from 'underscore';

import { UserService } from '@app/services/user.service';

/**
 * Activity Component
 */
@Component({
    selector: 'app-activity',
    templateUrl: './activity.component.html'
})
export class ActivityComponent implements OnInit {

    /**
     * List of dataset history actions
     */
    public history: any[] = [];

    /**
     * Current dataset history page number
     */
    private historyPage: number = 1;

    /**
     * Total dataset history activities number
     */
    private historyTotal: number = 0;

    /**
     * @ignore 
     */
    constructor(private userService: UserService) {
    }

    /**
     * Loads history actions on component init
     */
    ngOnInit() {
        this.loadHistory(this.historyPage);
    }

    /**
     * Loads dataset history actions and user activities
     * @param page 
     */
    public loadHistory(page) {
        this.historyPage = page;
        this.loadDatasetHistory(page);
        this.loadUserActivity(page);
    }

    /**
     * Loads user activities
     * @param page 
     */
    public loadUserActivity(page) {
        this.userService.getChangeHistory(page)
            .subscribe(history => {
                if (this.historyTotal < history.meta.count)
                    this.historyTotal += history.meta.count;
                this.history = this.history.concat(history.data);
                this.history = _.sortBy(this.history, 'change_timestamp');
            });
    }

    /**
     * Loads dataset history
     * @param page 
     */
    public loadDatasetHistory(page) {
        this.userService.getFollowedHistory(page)
            .subscribe(result => {
                if (this.historyTotal < result.meta.count)
                    this.historyTotal += result.meta.count;

                this.history = this.history.concat(result.data);
                this.history = _.sortBy(this.history, 'change_timestamp');
            });
    }
}
