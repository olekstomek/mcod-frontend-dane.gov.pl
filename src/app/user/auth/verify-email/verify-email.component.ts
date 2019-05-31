import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { UserService } from '@app/services/user.service';
import { SeoService } from '@app/services/seo.service';

/**
 * Verify Email Component
 */
@Component({
    selector: 'app-verify-email',
    templateUrl: './verify-email.component.html'
})
export class VerifyEmailComponent implements OnInit, OnDestroy {

    /**
     * Determines whether email has been verified
     */
    isVerified: boolean;
    userSubscription: Subscription;

    /**
     * @ignore
     */
    constructor(private route: ActivatedRoute,
                private seoService: SeoService,
                private userService: UserService) {
    }

    /**
     * Sets META tags (title). 
     * Verifies email based on provided token.
     */   
    ngOnInit() {
        this.seoService.setSeoByKeys('Action.Register', 'Slogan');
        const token = this.route.snapshot.paramMap.get('token');

        if (!token) return;

        this.userSubscription = this.userService
            .verifyEmail(token)
            .subscribe(() => {
                this.isVerified = true;
            });
    }

    /**
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy() {
        this.userSubscription.unsubscribe();
    }
}
