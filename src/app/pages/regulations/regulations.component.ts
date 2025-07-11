import { Component } from '@angular/core';
import { CmsHardcodedPages } from '@app/services/api/api.cms.config';

/**
* Regulations component
*/
@Component({
  selector: 'app-regulations',
  templateUrl: './regulations.component.html',
})
export class RegulationsComponent {

    /**
    * CMS static page slugs
    */
    readonly cmsHardcodedPages = CmsHardcodedPages;
}
