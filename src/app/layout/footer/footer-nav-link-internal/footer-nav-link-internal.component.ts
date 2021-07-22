import { Component, Input } from "@angular/core";

/**
 * Footer Nav Link Internal Component
 */
@Component({
    selector: "[app-footer-nav-link-internal]",
    templateUrl: "./footer-nav-link-internal.component.html",
})
export class FooterNavLinkInternalComponent {
    
    /**
     * Internal link
     */
    @Input() link: string;

    /**
     * Label translation key
     */
    @Input() labelTranslationKey: string;

    /**
     * Href attribute
     * @type {string}
     */
    @Input() href: string;
}
