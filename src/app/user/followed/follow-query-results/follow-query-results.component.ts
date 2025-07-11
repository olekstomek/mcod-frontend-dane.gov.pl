import {Component, EventEmitter, Input, Output} from '@angular/core';


/**
 * Component which displays followed queries
 */
@Component({
  selector: 'app-follow-query-results',
  templateUrl: './follow-query-results.component.html'
})
export class FollowQueryResultsComponent  {
    /**
     * data to display
     */
    @Input() items: any[];

    /**
     * unfollow event
     */
    @Output() unfollow = new EventEmitter<number>();

    /**
     * action invoked after clicking remove subscription
     * @param {number} index
     */
    onUnfollow(index: number) {
        this.unfollow.emit(index);
    }

}
