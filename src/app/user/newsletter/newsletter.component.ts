import {Component, OnDestroy, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, Validators} from '@angular/forms';

import {toggleVertically} from '@app/animations';
import {NewsletterService} from '@app/services/newsletter.service';
import {NewsletterConsents, NewsletterRequest} from '@app/services/models/newsletter-request';
import {NotificationsService} from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { CmsHardcodedPages } from '@app/services/api/api.cms.config';
import { CmsService } from '@app/services/cms.service';
import { IPageCms } from '@app/services/models/cms/page-cms';

@Component({
    selector: 'app-newsletter',
    templateUrl: './newsletter.component.html',
    animations: [
        toggleVertically
    ]
})
export class NewsletterComponent implements OnInit, OnDestroy {

    /**
    * CMS static page slugs
    */
     readonly cmsHardcodedPages = CmsHardcodedPages;
    
     /**
     * Determines whether all consents are checked
     */
    allChecked = false;

    /**
     * Success message after form is submitted
     */
    successMessage: string;

    /**
     * Newsletter consents
     */
    newsletterConsent: NewsletterConsents;

    /**
     * Newsletter form blueprint
     */
    newsletterForm: FormGroup;

    /**
     * Cms page consent
     */
    cmsPageInfo: IPageCms;

    /**
     * @ignore
     */
    constructor(private seoService: SeoService,
                private formBuilder: FormBuilder,
                private newsletterService: NewsletterService,
                private notificationsService: NotificationsService,
                private cmsService: CmsService) {
    }

    /**
     * Gets required consents.
     * Initializes form.
     */
    ngOnInit(): void {
        this.seoService.setPageTitleByTranslationKey(['Newsletter.Subscribe']);
        this.newsletterService.getNewsletterRegulations().subscribe(({data}) => this.newsletterConsent = data.attributes);

        this.initForm();
        this.getCmsConsent();
    }
    
    /**
     * Inits form
     */
    initForm(): void {
        this.newsletterForm = this.formBuilder.group({
            'email': [null, [Validators.required, Validators.email]],
            'personal_data_processing': [false, Validators.requiredTrue],
            'personal_data_use': [false, Validators.requiredTrue]
        });
    }

    /**
     * Gets cms consent
     */
     getCmsConsent() {
        this.cmsService.getSimplePage(CmsHardcodedPages.NEWSLETTER_DATA_PROCESSING_INFO).subscribe((page: IPageCms) => this.cmsPageInfo = page);
    }
    
    /**
     * Determines whether all consents are checked or unchecked
     * @param {boolean} isChecked 
     */
    onChangeAll(isChecked: boolean): void {
        this.allChecked = isChecked;

        this.newsletterForm.patchValue({
            'personal_data_processing': isChecked,
            'personal_data_use': isChecked
        });

        this.newsletterForm.get('personal_data_processing').markAsTouched();
        this.newsletterForm.get('personal_data_use').markAsTouched();
    }

    /**
     * Determines whether single consent is checked or unchecked
     * @param {string} fieldName 
     * @param {boolean} isChecked 
     */
    onChange(fieldName: string, isChecked: boolean): void {        
        this.newsletterForm.patchValue({
            [fieldName]: isChecked
        });

        this.allChecked = this.newsletterForm.get('personal_data_processing').valid && this.newsletterForm.get('personal_data_use').valid;
    }

    /**
     * Determines whether form is submitted
     */
    onSubmit(): void {
        if (this.newsletterForm.invalid) {
            return;
        }

        this.newsletterService.addNewsletterSubscription(this.newsletterForm.value).subscribe((response) => {
            this.successMessage = response.data.attributes.newsletter_subscription_info;
        }, (err) => {
            if (err.error.errors && err.error.errors.email) {
                this.notificationsService.clearAlerts();
                this.notificationsService.addError(err.error.errors.email + '.');
            }
        });
    }

    /**
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy(): void {
        this.notificationsService.clearAlerts();
    }
}
