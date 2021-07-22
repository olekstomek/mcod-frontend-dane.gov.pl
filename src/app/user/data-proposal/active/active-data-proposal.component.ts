import {Component, OnInit} from '@angular/core';
import { SeoService } from '@app/services/seo.service';

/**
 * Active Data Proposal Component
 */
@Component({
    selector: 'app-active-data-proposal',
    templateUrl: './active-data-proposal.component.html',
})
export class ActiveDataProposalComponent implements OnInit {
    
    /**
     * @ignore
     */
    constructor(private seoService: SeoService) {}

    /**
     * Sets title in a browser
     */
    ngOnInit(): void {
        this.seoService.setPageTitle(['Aktywne', 'Propozycje nowych danych', 'Mój Pulpit']);
    }

}
