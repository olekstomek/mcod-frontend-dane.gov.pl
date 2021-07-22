import { Component, OnInit, Input } from "@angular/core";
import { StringHelper } from "@app/shared/helpers/string.helper";
import { ActivatedRoute } from "@angular/router";
import { FormGroup, FormControl, Validators } from "@angular/forms";

import { SeoService } from "@app/services/seo.service";
import { DatasetService } from "@app/services/dataset.service";
import { toggleVertically } from "@app/animations/toggle-vertically";

/**
 * Submission Item Component
 */
@Component({
    selector: "app-submission-item",
    templateUrl: "./submission-item.component.html",
    animations: [
        toggleVertically
    ]
})
export class SubmissionItemComponent implements OnInit {

    /**
     * Submission - data proposal
     */
    submission: any;

    /**
     * Feedback form
     */
    feedbackForm: FormGroup;

    /**
     * Max number of characters in the feedback
     */
    @Input() minFeedbackLength = 3;

    /**
     * Max number of characters in the feedback
     */
    @Input() maxFeedbackLength = 3000;

    /**
     * Determines whether feedback is sent
     */
    isFeedbackSent: boolean;

    /**
     * @ignore
     */
    constructor(private activatedRoute: ActivatedRoute,
                private seoService: SeoService,
                private datasetService: DatasetService) {
    }

    /**
     * Sets META tags. 
     * Initializes feedback form.
     */
    ngOnInit(): void {
        this.submission = this.activatedRoute.snapshot.data.post.data;
        this.seoService.setPageTitle(this.submission.attributes.title);
        this.seoService.setDescriptionFromText(StringHelper.stripHtmlTags(this.submission.attributes.notes));
        this.initForm();
    }

    /**
     * Initializes form
     */
    initForm(): void {
        this.feedbackForm = new FormGroup({
            'feedback': new FormControl(null, [
                Validators.required, 
                Validators.minLength(this.minFeedbackLength), 
                Validators.maxLength(this.maxFeedbackLength)
            ]),
            'captcha': new FormControl(null, Validators.required)
        });
    }

    /**
     * Sends feedback on form submit
     */
    onFormSubmit(): void  {
        if (this.feedbackForm.invalid) {
            return;
        }

        const payload = `{
            "data": {
                "type": "comment",
                "attributes": {
                    "comment": ${JSON.stringify(this.feedbackForm.value.feedback)}
                }
            }
        }`;

        this.datasetService.sendSubmissionFeedback(this.submission.id, JSON.parse(payload)).subscribe(() => this.isFeedbackSent=true);
    }
}
