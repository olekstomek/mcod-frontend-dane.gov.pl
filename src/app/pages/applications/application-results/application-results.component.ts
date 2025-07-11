import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-application-results',
    templateUrl: './application-results.component.html'
})
export class ApplicationResultsComponent {
    /**
     * List of application items to display
     */
    @Input() items: any;
}
