import { Component, Input } from '@angular/core';

/**
 * Stats Component
 */
@Component({
	selector: 'home-stats',
	templateUrl: './stats.component.html'
})
export class StatsComponent {

    /**
     * Statistics data  of stats component
     */
    @Input() stats: any;
}
