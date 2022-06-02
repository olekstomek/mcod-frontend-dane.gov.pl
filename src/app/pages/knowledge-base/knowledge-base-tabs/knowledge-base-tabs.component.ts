import { Component } from '@angular/core';
import { ActivatedRoute, Router, NavigationEnd } from '@angular/router';

import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { CmsService } from '@app/services/cms.service';
import { IMetadataPageChildrenCms } from '@app/services/models/cms/metadata-page-cms';
import { SeoService } from '@app/services/seo.service';

/**
 * Knowledge Base Tabs Component - displays tabs
 */
@Component({
  selector: 'app-knowledge-base-tabs',
  templateUrl: './knowledge-base-tabs.component.html',
})
export class KnowledgeBaseTabsComponent {
  /**
   * Router endpoints
   */
  readonly routerEndpoints = RouterEndpoints;

  /**
   * cms tabs
   */
  tabs: IMetadataPageChildrenCms[];

  /**
   * Sets tabs and navigate to proper tab when there is no preview
   * Sets first tab as active, when no active tab (Breadcrumbs fix - dynamic tabs)
   */
  constructor(
    private seoService: SeoService,
    public cmsService: CmsService,
    private activatedRoute: ActivatedRoute,
    private router: Router,
  ) {
    this.setActiveTab();
  }

  /**
   * Sets active tab
   */
  setActiveTab() {
    this.router.events.subscribe(event => {
      if (event instanceof NavigationEnd) {
        if (!event.url.includes(this.routerEndpoints.KNOWLEDGE_BASE)) {
          return;
        }

        this.tabs = this.activatedRoute.snapshot.data.post.meta.children;
        let currentTab = this.tabs.find(tab => event.url.includes(tab.meta.slug));

        if (!currentTab) {
          currentTab = this.tabs[0];
        }

        this.seoService.setPageTitle(currentTab.title);

        if (event.url.split('/').length < 3) {
          this.router.navigate([`${this.routerEndpoints.KNOWLEDGE_BASE}/${currentTab.meta.slug}`]);
        }
      }
    });
  }
}
