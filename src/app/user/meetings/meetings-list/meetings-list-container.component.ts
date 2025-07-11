import { Component, Input } from '@angular/core';
import { UserDashboardListViewBaseComponent } from '@app/user/list-view/user-dashboard-list-view-base.component';
import { MeetingListItem } from '@app/user/meetings/MeetingListItem';

/**
 * Meetings List Component
 */
@Component({
    selector: 'app-meetings-list-container',
    templateUrl: './meetings-list-container.component.html'
})
export class MeetingsListContainerComponent extends UserDashboardListViewBaseComponent {

    /**
     * List of items (meetings)
     */
    @Input()
    items: MeetingListItem[];

}
