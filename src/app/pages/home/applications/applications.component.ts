import { Component, Input } from '@angular/core';

/**
 * Applications Component
 */
@Component({
    selector: 'home-applications',
    templateUrl: './applications.component.html'
})
export class ApplicationsComponent {

    /**
     * data (applications) of applications component
     */
    @Input() applications: any[];
}
