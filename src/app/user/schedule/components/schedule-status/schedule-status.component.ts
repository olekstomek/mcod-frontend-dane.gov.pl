import { Component, Input } from '@angular/core';

/**
 * Schedule Status Component
 */
@Component({
  selector: 'app-schedule-status',
  templateUrl: './schedule-status.component.html',
})
export class ScheduleStatusComponent {
  /**
   * Status completion flag
   */
  @Input()
  isCompleted: boolean;
}
