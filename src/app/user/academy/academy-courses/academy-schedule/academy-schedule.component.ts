import { Component, Input } from "@angular/core";

import { AodCourseScheduleDay } from "@app/user/academy/academy-courses/AodCourseScheduleDay";

/**
 * Academy Schedule Component
 */
@Component({
    selector: "app-academy-schedule",
    templateUrl: "./academy-schedule.component.html",
})
export class AcademyScheduleComponent {

    /**
     * AOD Course schedules grouped by month, related to a course
     */
    @Input() scheduleByMonth: {[key:string]: AodCourseScheduleDay[]};
}
