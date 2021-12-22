import { Component, Input } from '@angular/core';
import { ResultItemDetailsData } from '@app/services/models/result-item-details';

/**
 * TODO Create abstract component or interface for result item
 * Component which displays additional data on the right column of list view
 */
@Component({
    selector: 'app-details-result-item',
    templateUrl: './details-result-item.component.html'
})
export class DetailsResultItemComponent {
    /**
     * array with data which will be displayed
     */
    @Input() detailsData: ResultItemDetailsData [];

    /**
     * key to translation
     */
    @Input() titleTranslationKey: string;

    /**
     * enable/disable displaying each detail {key: value} in one row
     */
    @Input() showEachDetailInRow = false;

    @Input() isApplicationView = false;
}
