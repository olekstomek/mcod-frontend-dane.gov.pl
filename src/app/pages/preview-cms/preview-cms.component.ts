import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Params, Router } from '@angular/router';

/**
* Preview CMS pages component
*/
@Component({
  selector: 'app-preview-cms',
  templateUrl: './preview-cms.component.html'
})
export class PreviewCmsComponent implements OnInit {

    /**
     * Page url
     */
    requestedPageUrl: string;

    /**
     * Page query params
     */
    queryParams: Params;

    constructor(private activatedRoute: ActivatedRoute,
                private router: Router) {
    }

    /**
    * Get slug and query params from route. Display content only for admin.
    */
    ngOnInit() {
        this.queryParams = this.activatedRoute.snapshot.queryParams;
        this.requestedPageUrl = this.router.url;
    }
}


