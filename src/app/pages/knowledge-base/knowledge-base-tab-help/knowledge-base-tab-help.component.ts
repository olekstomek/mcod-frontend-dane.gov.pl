import { Component, OnInit } from '@angular/core';

import { SeoService } from '@app/services/seo.service';

/**
 * Knowledge Base Tab Help Component - routing and breadcrumb generation
 */
@Component({
    selector: 'app-knowledge-base-tab-help',
    templateUrl: './knowledge-base-tab-help.component.html'
})
export class KnowledgeBaseTabHelpComponent implements OnInit {
    
    /**
     * @ignore
     */
    constructor(private seoService: SeoService) { }

    /**
    * Sets META tags (title). 
    */
    ngOnInit() {
        this.seoService.setSeoByKeys('KnowledgeBase.Help');
    }

}
