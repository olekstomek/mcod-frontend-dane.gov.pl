import { Injectable, Renderer2 } from '@angular/core';

import { APP_CONFIG } from '@app/app.config';
import { AvailableIFrameService } from '@app/services/available-i-frame.service';
import { PostMessageIframeService } from '@app/services/post-message-iframe.service';

@Injectable({
    providedIn: 'root'
})
export class HighContrastService {

    /**
     * @ignore
     */
    constructor(private readonly postMessageService: PostMessageIframeService,
                private readonly availableIFrameService: AvailableIFrameService) {
    }

    private renderer: Renderer2;

    init(renderer: Renderer2) {
        this.renderer = renderer;
    }

    /**
     * Turns on high contrast. Improves accessibility for low-vision aids.
     * @param value
     */
    public useHighContrast(value: string): void {
        this.addClass(document['body'], value);
        this.useHightContrastInCmsElements(value);
        this.useHighContrastInIframeElements(value);

    }

    /**
     * Disables high contrast.
     *
     */
    public disableHighContrast(): void {
        this.removeCssClassFromAllSelectors('black-white');
        this.removeCssClassFromAllSelectors('black-yellow');
        this.removeCssClassFromAllSelectors('yellow-black');

        const ctaWidgets = this.searchElements('div[id^="cta_"]');
        ctaWidgets.map(path => {
            this.renderer.removeClass(path, 'cta_black-white');
            this.renderer.removeClass(path, 'cta_black-yellow');
            this.renderer.removeClass(path, 'cta_yellow-black');
        });

        this.availableIFrameService.getAvailable().forEach(element => {
            this.postMessageService.sendMessage(element.nativeElement,
                {eventName: APP_CONFIG.statsHighContrastEventName,  eventValue: null});
        });
    }
    /**
     * Turns high contrast in Cms elements
     * @param value
     */
    private useHightContrastInCmsElements(value: string): void {

        const ctaWidgets = this.searchElements('div[id^="cta_"]');
        ctaWidgets.map(path => {
            this.addClass(path, 'cta_' + value);
        });

        this.addClass(this.searchElement('span.carousel-control-prev-icon'), 'prev-icon--' + value);
        this.addClass(this.searchElement('span.carousel-control-next-icon'), 'next-icon--' + value);
        this.addClass(this.searchElement('a.carousel-control-prev'), value);
        this.addClass(this.searchElement('a.carousel-control-next'), value);
    }


    /**
     * Removes css class from all selectors
     * @param className
     */
    private removeCssClassFromAllSelectors(className: string): void {
        this.removeClass(document['body'], className);
        this.removeClass(this.searchElement('span.carousel-control-prev-icon'), 'prev-icon--' + className);
        this.removeClass(this.searchElement('span.carousel-control-next-icon'), 'next-icon--' + className);
        this.removeClass(this.searchElement('a.carousel-control-prev'), className);
        this.removeClass(this.searchElement('a.carousel-control-next'), className);
    }

    /**
     * Adds class
     * @param el
     * @param name
     */
    private addClass(el: any, name: string) {
        if (el == null) {
            return;
        }
        this.renderer.addClass(el, name);
    }

    /**
     * Removes class
     * @param el
     * @param name
     */
    private removeClass(el: any, name: string) {
        if (el == null) {
            return;
        }
        this.renderer.removeClass(el, name);
    }

    /**
     * Searches for element
     * @param selector
     * @returns {Element}
     */
    private searchElement(selector: string) {
        return document.querySelector(selector);
    }

    /**
     * Searches for elements
     * @param selector
     * @returns {T[]}
     */
    private searchElements(selector: string) {
        return Array.from(document.querySelectorAll(selector));
    }

    /**
     * Use high contrast in iframe elements
     * @param value
     */
    private useHighContrastInIframeElements(value: string): void {
        this.availableIFrameService.getAvailable().forEach(element => {
            this.postMessageService.sendMessage(element.nativeElement,
                {eventName: APP_CONFIG.statsHighContrastEventName,  eventValue: value});
        });

    }
}
