import { Component, OnInit } from '@angular/core';

import { SeoService } from '@app/services/seo.service';
import { CmsHardcodedPages } from '@app/services/api/api.cms.config';

@Component({
    selector: 'app-forum-regulations',
    templateUrl: './forum-regulations.component.html'
})
export class ForumRegulationsComponent implements OnInit {
    
    /**
    * CMS static page slugs
    */
    readonly cmsHardcodedPages = CmsHardcodedPages;

    /**
     * @ignore 
     */
    constructor(private seoService: SeoService) { }

    /**
     * Sets title (browser tab)
     */
    ngOnInit(): void {
        this.seoService.setPageTitleByTranslationKey(['Breadcrumbs.ForumRegulationsComponent']);
    }
}
