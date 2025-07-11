import { Component, OnInit} from '@angular/core';

import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { SeoService } from '@app/services/seo.service';

/**
 * Sitemap Component
 */
@Component({
    selector: 'app-sitemap',
    templateUrl: './sitemap.component.html'
})
export class SitemapComponent implements OnInit {
    /**
     * Router endpoints
     */
    readonly routerEndpoints = RouterEndpoints;
    
    /**
     * @ignore
     */
    constructor(private seoService: SeoService) {}

    /**
     * Sets title in a browser
     */
    ngOnInit(): void {
        this.seoService.setPageTitleByTranslationKey(['Menu.Sitemap']);
    }
}
