import { Component, Input } from '@angular/core';

/**
 * Component to show application items item results
 */
@Component({
    selector: 'app-dataset-item-results',
    templateUrl: './dataset-item-results.component.html'
})
export class DatasetItemResultsComponent {
    /**
     * items to display
     */
    @Input() items: any;
}
