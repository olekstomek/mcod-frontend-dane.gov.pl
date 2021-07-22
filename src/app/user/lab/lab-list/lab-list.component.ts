import { Component, Input, OnInit, Type } from '@angular/core';

import { UserDashboardListViewConfig } from '@app/user/list-view/UserDashboardListViewConfig';
import { LabListContainerComponent } from '@app/user/lab/lab-list/lab-list-container/lab-list-container.component';
import { API_URL } from '@app/user/list-view/API_URL';
import { ApiConfig } from '@app/services/api';

/**
 * Lab List Component
 */
@Component({
    selector: 'app-lab-list',
    templateUrl: './lab-list.component.html',
    providers: [{provide: API_URL, useValue: ApiConfig.lab}]
})
export class LabListComponent implements OnInit {
    /**
     * Type of laboratory items
     */
    @Input()
    type: string;

    config: UserDashboardListViewConfig;
    listContainer: Type<LabListContainerComponent> = LabListContainerComponent;

    ngOnInit(): void {
        this.config = new UserDashboardListViewConfig
            .builder()
            .default()
            .withSort('-execution_date')
            .withFoundedItemsCountHeader(this.type === 'research' ? 'Badania' : 'Analizy')
            .withAdditionalPageParams({event_type: this.type})
            .build();
    }
}
