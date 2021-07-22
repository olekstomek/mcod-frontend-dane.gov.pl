import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { toggleVertically } from '@app/animations';
import { SeoService } from '@app/services/seo.service';
import { DatasetService } from '@app/services/dataset.service';
import { NotificationsService } from '@app/services/notifications.service';

@Component({
    selector: 'app-suggest-dataset',
    templateUrl: './suggest-dataset.component.html',
    animations: [
        toggleVertically
    ]
})
export class SuggestDatasetComponent implements OnInit {
    /**
     * Application form of suggest application component
     */
    datasetForm: FormGroup;
    
    /**
     * Determines whether suggestion is sent
     */
    isSuggestionSent: boolean = false;

    /**
     * Max number of characters in notes (description)
     */
    maxDescriptionLength: number = 3000;
    
    /**
     * @ignore
     */
    constructor(private seoService: SeoService,
                private datasetService: DatasetService,
                private notificationsService: NotificationsService) {
    }

    /**
     * Sets META tags (title). 
     * Initializes form with predefined validators
     */
    ngOnInit() {
        this.seoService.setPageTitleByTranslationKey(['DatasetForm.Heading']);

        this.datasetForm = new FormGroup({
            'title': new FormControl(null, Validators.required),
            'notes': new FormControl(null, [Validators.required, Validators.maxLength(this.maxDescriptionLength)]),
            'organization_name': new FormControl(null),
            'data_link': new FormControl(null, Validators.pattern("^(https?)[^/]+(/.*)/[^/]+$")),
            'potential_possibilities': new FormControl(null),
            'captcha': new FormControl(null, Validators.required)
        });
    }

    /**
     * Determines whether dataset form is submitted
     */
    onDatasetFormSubmit() {
        if (!this.datasetForm.valid) return;

        this.notificationsService.clearAlerts();
        let formValue = {...this.datasetForm.value};

        // remove empty properties
        for (let key in formValue) {
            if (!formValue[key] || (formValue[key] && !formValue[key].length) || key === 'captcha') {
                delete formValue[key];
            }
        } 

        const payload = `{
            "data": {
                "type": "submission",
                "attributes": ${JSON.stringify(formValue)}
            }
        }`;

        this.datasetService
            .sendSubmission(JSON.parse(payload))
            .subscribe( 
                () => this.isSuggestionSent = true,
                (error) => {
                    this.notificationsService.addError(error);
                }
            );
    }
}
