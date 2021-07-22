import { isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, PLATFORM_ID } from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {NewsletterService} from '@app/services/newsletter.service';
import {Subscription} from 'rxjs';
import {HttpCustomErrorResponse, IErrorBackend} from '@app/services/models';

@Component({
    selector: 'app-unsubcribe-newsletter',
    templateUrl: './unsubcribe-newsletter.component.html'
})
export class UnsubcribeNewsletterComponent implements OnInit, OnDestroy {

    subscription: Subscription;
    successMessage: string;
    errorMessage: string;

    constructor(private route: ActivatedRoute,
                private newsletterService: NewsletterService,
                @Inject(PLATFORM_ID) private platformId: string) {
    }

    ngOnInit() {
        const token = this.route.snapshot.paramMap.get('token');
        if (!token) {
            return;
        }
        if (isPlatformBrowser(this.platformId)) {

            this.subscription = this.newsletterService.removeNewsletterSubscription(token)
                .subscribe((response) => {
                    this.successMessage = response.data.attributes.newsletter_subscription_info;
                }, (customError: HttpCustomErrorResponse) => {
                    this.errorMessage = this.newsletterService.getNewsletterError(customError);
                });
        }
    }

    /**
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy() {
        isPlatformBrowser(this.platformId) && this.subscription.unsubscribe();
    }
}
