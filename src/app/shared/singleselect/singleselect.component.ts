import { Component, ElementRef, EventEmitter, Input, OnDestroy, OnInit, Output, Renderer2, ViewChild, OnChanges, SimpleChanges } from '@angular/core';

import { toggleVertically } from '@app/animations';


/**
 * A counterpart to multiselect component. Allows to store and select only one element.
 * @example
 * <app-singleselect [options]="[1,2,3,4]" [(selected)]="selected" placeholder="Label"></app-multiselect>
 */
@Component({
    selector: 'app-singleselect',
    templateUrl: './singleselect.component.html',
    animations: [
        toggleVertically
    ]
})
export class SingleselectComponent implements OnInit, OnDestroy, OnChanges {

    @Input() options: any[];
    @Input() selected: any;
    @Input() placeholder: string;
    @Input() isUp: boolean = false;
    @Input() labelId: string;

    @Output() selectedChange = new EventEmitter();
    @ViewChild('toggler') toggler: ElementRef;

    isExpanded: boolean = false;
    generatedId: string;
    togglerLabel: string;

    private clickOutsideListener: () => void;
    private clickEscapeListener: () => void;


    /**
     * @ignore
     */
    constructor(private elementRef: ElementRef,
                private renderer: Renderer2) {
        this.clickOutsideListener = this.renderer.listen('body', 'click', this.clickOutside.bind(this));
        this.clickEscapeListener = this.renderer.listen('body', 'keydown.esc', (event: KeyboardEvent) => {

            // event.key may vary depending on a browser
            if (event.keyCode === 27) {
                this.isExpanded = false;
            }
        });
    }

    /**
     * Create unique id
     */
    ngOnInit() {
        this.generatedId = `dropdown-${ Math.floor(Math.random() * 899 + 100)}`;
    }

    /**
     * On Input changes set displayed label based on whether item is selected or not
     * @param {SimpleChanges} changes
     */
    ngOnChanges(changes: SimpleChanges) {

        if (!this.options.length) return;

        const firstOption = this.options[0];
        const optionsAreObjects = this.isObject(this.options[0]);

        if (changes.selected && !changes.selected.currentValue) {
            this.togglerLabel = this.placeholder || this.isObject(firstOption) ? firstOption.label : firstOption;
        } else {

            if (optionsAreObjects) {
                const matchingOption = this.options.find(option => option['value'] === this.selected);

                if (matchingOption) {
                    this.togglerLabel = matchingOption['label'];
                }
            } else {
                this.togglerLabel = this.selected;
            }
        }
    }

    /**
     * Remove listeners
     */
    ngOnDestroy() {
        this.clickOutsideListener();
        this.clickEscapeListener();
    }

    /**
     * Click outside event handler
     * @param event
     */
    clickOutside(event) {
        const targetElement = event.target as HTMLElement;
        const parentElement = this.elementRef.nativeElement as HTMLElement;
        const clickedInside = parentElement.outerHTML.indexOf(targetElement.outerHTML) !== -1;

        if (!clickedInside) {
            this.isExpanded = false;
        }
    }

    /**
     * Click/Select item event handler
     * @param item
     */
    selectItem(item) {
        this.selected = item;
        this.selectedChange.emit(this.selected);
        this.isExpanded = false;

        setTimeout(() => {
            (<HTMLInputElement>this.toggler.nativeElement).focus();
        });
    }

    /**
     * Toggle dropdown handler
     */
    toggleDropdown() {
        this.isExpanded = !this.isExpanded;
    }

    /**
     * Return if item is selected and style based on result
     * @param item
     * @returns {boolean}
     */
    isItemSelected(item) {
        return this.isObject(this.selected) ? this.selected === item : this.selected === item.value;
    }

    /**
     * isObject Helper function
     * @param item
     * @returns {boolean}
     */
    isObject(item) {
        return Object.prototype.toString.call(item) === '[object Object]';
    }
}
