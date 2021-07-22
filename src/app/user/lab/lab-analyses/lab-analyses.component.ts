import {Component, OnInit} from '@angular/core';

import { SeoService } from '@app/services/seo.service';

/**
 * Lab Analyses Component
 */
@Component({
    selector: 'app-lab-analyses',
    templateUrl: './lab-analyses.component.html',
})
export class LabAnalysesComponent implements OnInit {
    
    /**
     * @ignore
     */
    constructor(private seoService: SeoService) {}

    /**
     * Sets title in a browser
     */
    ngOnInit(): void {
        this.seoService.setPageTitle(['Analizy', 'Laboratorium Otwartych Danych', 'Mój Pulpit']);
    }
}
