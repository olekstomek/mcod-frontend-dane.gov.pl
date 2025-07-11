import { Component, Input } from '@angular/core';
import { UserDashboardListViewBaseComponent } from '@app/user/list-view/user-dashboard-list-view-base.component';

/**
 * Lab List Component
 */
@Component({
    selector: 'app-lab-list-container',
    templateUrl: './lab-list-container.component.html',
})
export class LabListContainerComponent extends UserDashboardListViewBaseComponent {
    /**
     * Type of laboratory items
     */
    @Input()
    items: any;
}
