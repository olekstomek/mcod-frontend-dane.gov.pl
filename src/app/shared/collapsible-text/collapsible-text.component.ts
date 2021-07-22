import { Component, Input } from '@angular/core';
import { StringHelper } from '../helpers/string.helper';

/**
 * Truncated text component with expand/ collapse button
 */
@Component({
    selector: 'collapsible-text',
    templateUrl: './collapsible-text.component.html'
})
export class CollapsibleTextComponent {

    /**
     * Text do display
     */
    @Input() text: string;

    /**
     * Text do display
     */
    @Input() tags: any;

    /**
     * Truncated text length
     */
    @Input()  maxTextLength = 400;

    /**
     * Is text collapsed
     */
    isCollapsed = true;

    /**
     * Random id
     */
    generatedId = StringHelper.generateRandomHex();
}
