import {Component, Input} from '@angular/core';

/**
 * Notifications components displays global notifications from Notification Service
 * @example
 * <app-notifications></app-notifications>
 */
@Component({
    selector: '[app-notifications]',
    templateUrl: './notifications.component.html'
})
export class NotificationsComponent {

    @Input() alerts: any[];

    /**
     * @ignore
     */
    constructor() {
    }
}
