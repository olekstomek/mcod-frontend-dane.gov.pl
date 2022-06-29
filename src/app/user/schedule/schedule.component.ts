import { Component } from '@angular/core';

import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';

/**
 * Schedule Component
 */
@Component({
  selector: 'app-schedule',
  templateUrl: './schedule.component.html',
})
export class ScheduleComponent {
  /**
   * @ignore
   */
  PermissionPerRoles: typeof PermissionPerRoles = PermissionPerRoles;
}
