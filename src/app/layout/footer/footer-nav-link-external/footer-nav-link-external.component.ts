import { Component, Input } from "@angular/core";

/**
 * Footer Nav Link External Component
 */
@Component({
    selector: "[app-footer-nav-link-external]",
    templateUrl: "./footer-nav-link-external.component.html",
})
export class FooterNavLinkExternalComponent {
    
    /**
     * External link
     */
    @Input() link: string;

    /**
     * Label translation key
     */
    @Input() labelTranslationKey: string;
}
