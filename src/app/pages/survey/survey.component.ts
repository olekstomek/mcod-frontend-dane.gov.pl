import { Component, OnInit } from '@angular/core';
import { CmsService } from '@app/services/cms.service';
import { ActivatedRoute, Params, Router } from '@angular/router';
import { ICmsForm } from '@app/services/models/cms/forms/cms-form';
import {CmsFormset} from '@app/services/models/cms/forms/cms-formset';

/**
 * Survey page component
 */
@Component({
  selector: 'app-survey',
  templateUrl: './survey.component.html'
})
export class SurveyComponent implements OnInit {

    /**
     * Page slug
     */
    requestedSlug: string;

    /**
     * Page query params
     */
    queryParams: Params;

    /**
     * Survey page to display
     */
    cmsForm: ICmsForm;

    constructor(private cmsService: CmsService,
                private route: ActivatedRoute,
                private router: Router) {}

    /**
     * Loads survey page
     */
    ngOnInit() {
        this.queryParams = {...this.route.snapshot.queryParams};
        this.requestedSlug = this.router.url.substring(3);

        this.cmsService.getForms(this.requestedSlug, this.queryParams.lang, this.queryParams.rev)
            .subscribe( (page: ICmsForm) => {
                    this.cmsForm = page;
                },
                err => {
                    this.cmsService.displayCmsErrorMessage(this.requestedSlug, err.message);
                    this.router.navigate(['/']);
                });
    }
}
