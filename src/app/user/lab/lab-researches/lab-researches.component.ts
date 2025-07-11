import { Component, OnInit } from "@angular/core";

import { SeoService } from "@app/services/seo.service";

/**
 * Lab Researches Component
 */
@Component({
    selector: "app-lab-researches",
    templateUrl: "./lab-researches.component.html",
})
export class LabResearchesComponent implements OnInit {
    
    /**
     * @ignore
     */
    constructor(private seoService: SeoService) {}

    /**
     * Sets title in a browser
     */
    ngOnInit(): void {
        this.seoService.setPageTitle(['Badania', 'Laboratorium Otwartych Danych', 'Mój Pulpit']);
    }
}
