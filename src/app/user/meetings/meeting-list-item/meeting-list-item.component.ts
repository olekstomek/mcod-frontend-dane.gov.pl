import { Component, Input } from '@angular/core';

import { MeetingListItem } from '@app/user/meetings/MeetingListItem';
import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';

/**
 * Meeting List Item Component
 */
@Component({
    selector: 'app-meeting-list-item',
    templateUrl: './meeting-list-item.component.html',
})
export class MeetingListItemComponent {

    /**
     * MeetingListItem
     */
    @Input() meeting: MeetingListItem;

    /**
     * @ignore
     */
    PermissionPerRoles: typeof PermissionPerRoles = PermissionPerRoles;
}
