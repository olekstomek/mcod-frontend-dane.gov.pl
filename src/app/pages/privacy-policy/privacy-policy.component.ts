import { Component } from '@angular/core';

import { CmsHardcodedPages } from '@app/services/api/api.cms.config';
import { CmsStaticPageComponent } from '@app/shared/cms/cms-static-page/cms-static-page.component';

/**
 * Privacy Policy and GDPR page - CMS content
 */
@Component({
  selector: 'app-privacy-policy',
  templateUrl: './privacy-policy.component.html',
  imports: [CmsStaticPageComponent],
  standalone: true,
})
export class PrivacyPolicyComponent {
  /**
   * CMS static page slugs
   */
  readonly cmsHardcodedPages = CmsHardcodedPages;
}
