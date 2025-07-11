import { Component, Input } from '@angular/core';

/**
 * Institutions Component
 */
@Component({
	selector: 'home-institutions',
	templateUrl: './institutions.component.html',
})
export class InstitutionsComponent {

    /**
     * Items (institutions) of institutions component
     */
    @Input() items;
}
