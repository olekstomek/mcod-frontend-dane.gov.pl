import { Component, Output, EventEmitter, Input, SimpleChanges } from "@angular/core";

import { StringHelper } from "../helpers/string.helper";

@Component({
    selector: "app-items-per-page",
    templateUrl: "./items-per-page.component.html",
})
export class ItemsPerPageComponent {
    /**
     * List of options to choose from
     */
    @Input() options = [5, 10, 20, 50];

    /**
     * Selected option
     */
    @Input() selected: number;

    /**
     * Emits selected item
     */
    @Output() selectedChange = new EventEmitter();

    /**
     * Determines whether number exists in array of options
     */
    isNumberValid: boolean;
    
    /**
     * Unique id
     */
    uniqueId = StringHelper.generateRandomHex();

    /**
     * Emits value on change
     * @param {number} value 
     */
    onChange(value: number) {
        this.selectedChange.emit(value);
    }

    /**
     * Determines whether provided sort value exists on the list of sort options.
     * Filters out counters with '0' value
     * @param {SimpleChanges} changes 
     */
    ngOnChanges(changes: SimpleChanges) {
        this.selected = Number(this.selected);
        if (changes.selected) {
            this.isNumberValid = !!this.options.find(option => option === Number(changes.selected.currentValue));
        }
    }
}
