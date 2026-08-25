import { Component, inject, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe } from '@ngx-translate/core';
import {
  CONTACT_PAGE_LOCALIZED_ROUTE,
  isNewContactPageEnabled,
} from '@app/shared/forms/form-pages/contact-form/contact-page.config';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { SeoService } from '@app/services/seo.service';
import { WriteUsInfoComponent } from '@app/shared/write-us-info/write-us-info.component';

/**
 * Sitemap Component
 */
@Component({
  selector: 'app-sitemap',
  templateUrl: './sitemap.component.html',
  imports: [TranslatePipe, RouterLink, LocalizeRouterPipe, WriteUsInfoComponent],
  standalone: true,
})
export class SitemapComponent implements OnInit {
  /**
   * Router endpoints
   */
  readonly routerEndpoints = RouterEndpoints;
  readonly contactRoute = CONTACT_PAGE_LOCALIZED_ROUTE;
  readonly isNewContactPageEnabled = isNewContactPageEnabled(inject(FeatureFlagService));

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
