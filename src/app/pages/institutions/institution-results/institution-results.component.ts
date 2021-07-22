import { Component, Input } from '@angular/core';

/**
 * Component which displays results for providers using list
 */
@Component({
    selector: 'app-institution-results',
    templateUrl: './institution-results.component.html'
})
export class InstitutionResultsComponent {
    /**
     * data to display
     */
    @Input() items: any[];
}
