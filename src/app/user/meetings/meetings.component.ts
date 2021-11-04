import { Component, OnInit } from '@angular/core';

import { ApiConfig } from '@app/services/api';
import { UserDashboardListViewConfig } from '@app/user/list-view/UserDashboardListViewConfig';
import { API_URL } from '@app/user/list-view/API_URL';
import { MeetingType } from '@app/user/meetings/MeetingType';
import { MeetingsListContainerComponent } from '@app/user/meetings/meetings-list/meetings-list-container.component';
import { UserService } from '@app/services/user.service';
import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';
import { SeoService } from '@app/services/seo.service';

/**
 * Meetings Component
 */
@Component({
    selector: 'app-meetings',
    templateUrl: './meetings.component.html',
    providers: [
        {provide: API_URL, useValue: ApiConfig.meetings}
    ]
})
export class MeetingsComponent implements OnInit {

    /**
     * @ignore
     */
    constructor(private seoService: SeoService,
                private readonly userService: UserService) {
    }

    /**
     * List container component
     * @type {MeetingsListContainerComponent}
     */
    meetingsListContainerComponent: any = MeetingsListContainerComponent;

    /**
     * List config
     */
    config: UserDashboardListViewConfig;

    /**
     * Setups list config
     */
    ngOnInit(): void {
        this.seoService.setPageTitle(['Spotkania pełnomocników', 'Mój Pulpit']);
        this.setupListConfig();
    }

    /**
     * Setups list config
     */
    private setupListConfig(): void {
        const currentUserHasPermissionToFilters = this.userService.hasRequiredRole(PermissionPerRoles.FILTER_MEETINGS);
        const filterConfig = {
            filterType: MeetingType, 
            selectedFilters: [
                MeetingType.PLANNED.toString(),
                MeetingType.FINISHED.toString()
            ], 
            title: 'Status spotkań'
        };
        this.config = new UserDashboardListViewConfig
            .builder()
            .default()
            .withFoundedItemsCountHeader(null)
            .withSort('-start_date')
            .withFilterConfig(currentUserHasPermissionToFilters ? filterConfig : null)
            .build();
    }
}
