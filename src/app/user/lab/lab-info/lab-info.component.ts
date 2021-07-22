import {Component, OnInit} from '@angular/core';
import {CmsHardcodedPages} from '@app/services/api/api.cms.config';
import { SeoService } from '@app/services/seo.service';

@Component({
    selector: 'app-lab-info',
    templateUrl: './lab-info.component.html',
})
export class LabInfoComponent implements OnInit {
    
    /**
     * CMS static page slugs
     */
    readonly cmsHardcodedPages = CmsHardcodedPages;
    
    /**
     * @ignore
     */
    constructor(private seoService: SeoService) {}

    /**
     * Sets title in a browser
     */
    ngOnInit(): void {
        this.seoService.setPageTitle(['Informacje', 'Laboratorium Otwartych Danych', 'Mój Pulpit']);
    }
}
