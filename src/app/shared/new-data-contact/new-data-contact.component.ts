import { Component, Input } from '@angular/core';

/**
 * Result item for component with files
 */
@Component({
    selector: 'app-new-data-contact',
    templateUrl: './new-data-contact.component.html',
})
export class NewDataContactComponent {
    @Input() buttonTranslationKey: string;
    @Input() routerLink: string;
    @Input() titleTranslationKey: string;
}
