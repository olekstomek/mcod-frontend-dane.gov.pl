import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { DatasetService } from '@app/services/dataset.service';
import { NotificationsService } from '@app/services/notifications.service';

/**
 * Categories Component
 */
@Component({
	selector: 'home-categories',
	templateUrl: './categories.component.html',
    providers: [NotificationsService]
})
export class CategoriesComponent implements OnInit, OnDestroy {
    /**
     * Dataset subscription of categories component
     */
    datasetSubscription: Subscription;

    /**
     * Items (categories) of categories component
     */
    items;

    /**
     * @ignore
     */
    constructor(private datasetService: DatasetService,
                private notificationsService: NotificationsService) {
    }

    /**
     * Initializes list of items (dataset categories).
     */    
	ngOnInit() {
        this.datasetSubscription = this.datasetService
            .getFilters()
            .subscribe(
                filters => this.items = filters['by_category'],
                error => {
                    if (error.message)
                        this.notificationsService.addError(error.message)
                    if (error.description)
                        this.notificationsService.addError(error.description)
                }
        );
    }

    /**
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy() {
        this.datasetSubscription.unsubscribe();
    }
}
