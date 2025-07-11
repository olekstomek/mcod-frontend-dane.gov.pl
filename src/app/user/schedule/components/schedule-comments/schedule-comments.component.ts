import { Component, OnInit, Input } from "@angular/core";

import { SchedulePlanningService } from "@app/user/schedule/tabs/planning/schedule-planning.service";
import { ScheduleItemComment } from "@app/user/schedule/components/schedule-comments/schedule-item-comment";

@Component({
    selector: "app-schedule-comments",
    templateUrl: "./schedule-comments.component.html",
})
export class ScheduleCommentsComponent implements OnInit {

    /**
     * Schedule item id
     */
    @Input() scheduleItemId: string;

    /**
     * List of comments
     */
    comments: ScheduleItemComment[];
    
    /**
     * @ignore
     */
    constructor(private schedulePlanningService: SchedulePlanningService) {}

    /**
     * Initializes list of comments
     */
    ngOnInit() {
        this.getComments();
    }
    
    /**
     * Gets list of comments
     */
    getComments() {
        this.schedulePlanningService.getScheduleItemComments(this.scheduleItemId).subscribe(comments => this.comments = comments);
    }
}
