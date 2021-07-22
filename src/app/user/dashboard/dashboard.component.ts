import { Component } from '@angular/core';
import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';

/**
 * Dashboard Component
 */
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent {
    sidebarVisible = true;
    /**
     * @ignore
     */
    PermissionPerRoles: typeof PermissionPerRoles = PermissionPerRoles;
}
