import { Component, Input, OnInit, OnDestroy } from '@angular/core';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';
import { BehaviorSubject, Subscription } from 'rxjs';
import { toggleVertically } from '@app/animations/toggle-vertically';

/**
 * Cms blocks component
 */
@Component({
  selector: 'cms-block2',
  templateUrl: './cms-block2.component.html',
  animations: [toggleVertically],
})
export class CmsBlock2Component implements OnInit, OnDestroy {
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

  @Input() isFooterLogos = false;

  /**
   * Widget type enum
   */
  readonly widgetType = WidgetType;

  /**
   * Array of widgets
   */
  widgets: IWidget[] = [];

  /**
   * Flag for loaded content, does not display carousel if content is not ready
   */
  contentHasLoaded = false;

  widgetsSubjectSubscription: Subscription;

  /**
   * Subscribe to widgetSubject
   */
  ngOnInit() {
    if (this.widgetsSubject) {
      this.widgetsSubjectSubscription = this.widgetsSubject.subscribe(response => {
        this.widgets = response;
      });
    } else {
      this.widgets.push(this.oneWidget);
    }
  }

  ngOnDestroy() {
    this.widgetsSubjectSubscription?.unsubscribe();
  }
}
