import { Component, HostListener, Input, OnInit, ViewChild } from '@angular/core';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';
import { BehaviorSubject } from 'rxjs';
import { CarouselComponent } from 'ngx-bootstrap';

/**
* Cms blocks component
*/
@Component({
    selector: 'cms-block',
    templateUrl: './cms-block.component.html'
})

export class CmsBlockComponent implements OnInit {

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
    * Carousel component
    */
    @ViewChild(CarouselComponent) carouselComponent: CarouselComponent;

    /**
    * Host listener for enter events
    */
    @HostListener('keyup.enter', ['$event']) onKeyUp(event: KeyboardEvent) {
        if ((event as any).srcElement.classList.contains('carousel')) {
            this.onSlideClick(event);
        }
    }

    /**
    * Subscribe to widgetSubject
    */
    ngOnInit() {
        if (this.widgetsSubject) {
            this.widgetsSubject.subscribe(response => {
                if (response) {
                    this.widgets = response;
                }
            });
        } else {
            this.widgets.push(this.oneWidget);
        }
    }

    /**
    * Carousel event handler on enter keystroke
    * @param {event} event
    */
    private onSlideClick(event) {
        const lastSlideIndex = this.carouselComponent.slides.length - 1;
        const nextSlideIndex =   this.carouselComponent.getCurrentSlideIndex();
        const activeSlideIndex = nextSlideIndex - 1 < 0 ? lastSlideIndex : nextSlideIndex - 1;

        const slidesNodesArray = event.target.querySelectorAll('slide');
        const actualSlideNode = slidesNodesArray[activeSlideIndex];
        const imageLink = actualSlideNode.querySelector('a').href;
        this.carouselComponent.previousSlide(true);
        window.location.href = (imageLink);
    }
}
