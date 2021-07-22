import { Component, Input } from '@angular/core';

/**
 * Categories Component
 */
@Component({
    selector: 'home-section-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent {

    /**
     * Router url
     */
    @Input() routerURL: string;

    /**
     * Link test
     */
    @Input() text: string;
}
