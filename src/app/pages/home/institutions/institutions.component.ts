import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { DatasetService } from '@app/services/dataset.service';
import { NotificationsService } from '@app/services/notifications.service';

/**
 * Institutions Component
 */
@Component({
	selector: 'home-institutions',
	templateUrl: './institutions.component.html',
    providers: [NotificationsService]
})
export class InstitutionsComponent implements OnInit {
    /**
     * Dataset subscription of institutions component
     */
    datasetSubscription: Subscription;

    /**
     * Items (institutions) of institutions component
     */
    items;

    /**
     * @ignore  
     */
    constructor(private datasetService: DatasetService,
                private notificationsService: NotificationsService) { 
    }

    /**
     * Initializes list of items (institutions).
     */    
	ngOnInit() {
        this.datasetSubscription = this.datasetService
            .getFilters()
            .subscribe(
                filters => this.items = filters['by_institution'].slice(0, 8),
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
        this.notificationsService.clearAlerts();
        this.datasetSubscription.unsubscribe();
    }
}
