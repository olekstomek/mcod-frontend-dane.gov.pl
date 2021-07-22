import { Component, Input, OnInit } from '@angular/core';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';
import { BehaviorSubject } from 'rxjs';
import { toggleVertically } from '@app/animations/toggle-vertically';

/**
* Cms blocks component
*/
@Component({
    selector: 'cms-block2',
    templateUrl: './cms-block2.component.html',
    animations: [
        toggleVertically
    ]
})

export class CmsBlock2Component implements OnInit {

    /**
    * Widget subject
    */
    @Input() widgetsSubject: BehaviorSubject<IWidget[]>;

    /**
    * Determines whether to show the carousel
    */
    @Input() showCarousel = false;

    /**
    * Widget to display
    */
    @Input() oneWidget: IWidget;

    /**
     * Is full width
     */
    @Input() isFullWidth = true;

    /**
     * Additional container class
     * @type {string}
     */
    @Input() className: string;

    /**
    * Widget type enum
    */
    readonly  widgetType = WidgetType;

    /**
    * Array of widgets
    */
    widgets: IWidget[] = [];

    /**
    * Flag for loaded content, does not display carousel if content is not ready
    */
    contentHasLoaded = false;

    /**
    * Subscribe to widgetSubject
    */
    ngOnInit() {
        if (this.widgetsSubject) {
            this.widgetsSubject.subscribe(response => {
                this.widgets = response;
            });
        } else {
            this.widgets.push(this.oneWidget);
        }
    }
}
