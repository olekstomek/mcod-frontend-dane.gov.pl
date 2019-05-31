import { Component, OnInit } from '@angular/core';

import { SeoService } from '@app/services/seo.service';

/**
 * Knowledge Base Tab Education Component - routing and breadcrumb generation
 */
@Component({
    selector: 'app-knowledge-base-tab-education',
    templateUrl: './knowledge-base-tab-education.component.html'
})
export class KnowledgeBaseTabEducationComponent implements OnInit {
    
    /**
     * @ignore
     */
    constructor(private seoService: SeoService) { }

    /**
    * Sets META tags (title). 
    */
    ngOnInit() {
        this.seoService.setSeoByKeys('KnowledgeBase.EducationalMaterials');
    }

}
