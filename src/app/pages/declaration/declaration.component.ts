import { Component, OnInit } from "@angular/core";

import { CmsHardcodedPages } from "@app/services/api/api.cms.config";

/**
 * Declaration of availability - CMS content
 */
@Component({
    selector: "app-declaration",
    templateUrl: "./declaration.component.html",
})
export class DeclarationComponent {

    /**
    * CMS static page slugs
    */
    readonly cmsHardcodedPages = CmsHardcodedPages;
}
