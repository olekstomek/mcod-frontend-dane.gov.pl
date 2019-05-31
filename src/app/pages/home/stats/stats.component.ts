import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { AbstractService } from '@app/services/abstract.service';
import { ApiConfig } from '@app/services/api';

/**
 * Stats Component
 */
@Component({
	selector: 'home-stats',
	templateUrl: './stats.component.html'
})
export class StatsComponent implements OnInit {
    /**
     * Stats subsciption of stats component
     */
    statsSubsciption: Subscription;

    /**
     * Statistics data  of stats component
     */
    stats: any;

    /**
     * @ignore
     */   
	constructor(private api: AbstractService) { }

    /**
     * Initializes and checks existence of required statistics.
     */  
	ngOnInit() {
        this.statsSubsciption = this.api
            .getRequest(ApiConfig.stats)
            .subscribe(data => {
                this.stats = data.meta.aggs.documents_by_type.reduce((object, item) => {
                    object[item.id] = item;
                    return object;
                }, {});

                if (Object.keys(this.stats).length < 3)
                    this.stats = null;
            });
	}

    /**
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy() {
        this.statsSubsciption.unsubscribe();
    }
}
