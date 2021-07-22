import { Component, Inject, Input, OnInit, Optional } from '@angular/core';

import { TooltipData, TOOLTIP_DATA } from '@app/shared/tooltip/TooltipData';

/**
 * Tooltip with title component
 */
@Component({
    selector: 'app-tooltip-with-title',
    templateUrl: './tooltip-with-title.component.html'
})
export class TooltipWithTitleComponent implements OnInit {
    /**
     * Tooltip title
     * @type {string}
     */
    @Input()
    title: string;
    /**
     * Tooltip text
     * @type {string}
     */
    @Input()
    text: string;

    /**
     * @ignore
     */
    constructor(@Optional() @Inject(TOOLTIP_DATA) public componentData: TooltipData) {
    }

    /**
     * Setups component data
     */
    ngOnInit() {
        this.title = this.title || this.componentData?.title;
        this.text = this.text || this.componentData?.text;
    }

}
