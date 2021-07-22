import { Component, Input } from '@angular/core';

import { ApiModel } from '@app/services/api/api-model';

@Component({
    selector: 'app-institution-item-results',
    templateUrl: './institution-item-results.component.html'
})
export class InstitutionItemResultsComponent {
    
    /**
     * API model
     */
    apiModel = ApiModel;
    
    @Input() items: any;
}
