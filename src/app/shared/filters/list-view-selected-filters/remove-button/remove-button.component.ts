import { Component, EventEmitter, Input, Output, TemplateRef } from '@angular/core';
import { StartEndDateRange } from '@app/services/models/startEndDateRange';

/**
 * Remove selected filters component
 */
@Component({
    selector: 'app-remove-button',
    templateUrl: './remove-button.component.html',
})
export class RemoveButtonComponent {
    /**
     * filter do display
     */
    @Input() item: { key: string, value: any };

    /**
     * templateRef to display
     */
    @Input() templateRef: TemplateRef<any>;

    /**
     * remove selected filter event
     */
    @Output() removeSelectedFilter = new EventEmitter<string>();

    /**
     * triggers event whitch selected key when element clicked
     * @param {string} key
     */
    onRemoveSelectedFilter(key: string) {
        this.removeSelectedFilter.next(key);
    }
}
