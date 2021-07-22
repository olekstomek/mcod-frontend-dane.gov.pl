import { Component, Input } from '@angular/core';

/**
 * Component to show application items item results
 */
@Component({
    selector: 'app-application-item-results',
    templateUrl: './application-item-results.component.html'
})
export class ApplicationItemResultsComponent {
    /**
     * items to display
     */
    @Input() items: any;
}
