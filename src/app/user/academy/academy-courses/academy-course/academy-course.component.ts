import { Component, Input } from "@angular/core";

import { AodCourseScheduleDay } from "@app/user/academy/academy-courses/AodCourseScheduleDay";
import { AodCourse } from "@app/user/academy/academy-courses/AodCourse";

/**
 * Academy Course Component
 */
@Component({
    selector: "app-academy-course",
    templateUrl: "./academy-course.component.html",
})
export class AcademyCourseComponent {

    /**
     * AOD course
     */
    @Input() course: AodCourse;

    /**
     * AOD Course schedules grouped by month, related to all the courses
     */
    @Input('courseSchedulesByMonth') schedulesByMonth: {[key:string]: AodCourseScheduleDay[]};

    /**
     * AOD Course schedules grouped by type without duplicates, related to all the courses
     */
    @Input('courseSchedulesByType') schedulesByType: {[key:string]: string};
}
