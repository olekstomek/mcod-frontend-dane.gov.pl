import { Component, OnInit } from '@angular/core';

import { AbstractService } from '@app/services/abstract.service';
import { ApiConfig } from '@app/services/api';

/**
 * Service Alert Component
 */
@Component({
    selector: 'home-service-alert',
    templateUrl: './service-alert.component.html'
})
export class ServiceAlertComponent implements OnInit {

    /**
     * Service alerts of service alert component
     */
    serviceAlerts;

    /**
     * @ignore
     */   
	constructor(private api: AbstractService) { }

    /**
     * Initializes service alert.
     */
    ngOnInit() {
        this.api
            .getRequest(ApiConfig.stats)
            .subscribe(data => this.serviceAlerts = data.meta.alerts);        
    }

}
