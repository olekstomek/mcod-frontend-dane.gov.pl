import { Component, OnInit, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { UserService } from '@app/services/user.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { toggleVertically } from '../../../animations/index';

/**
 * Lost Password Component
 */
@Component({
    selector: 'app-lost-password',
    templateUrl: './lost-password.component.html',
    animations: [
        toggleVertically
    ]
})
export class LostPasswordComponent implements OnInit, OnDestroy {
    /**
     * Forgotten password subscription of lost password component
     */
    forgottenPasswordSubscription: Subscription;

    /**
     * Form submission availability indicator
     */
    isSubmitDisabled: boolean = false;

    /**
     * Determines whether lost password message Was sent
     */
    mailSent: boolean = false;

    /**
     * @ignore
     */
    constructor(private notificationsService: NotificationsService,
                private userService: UserService,
                private seoService: SeoService
    ) {}

    /**
     * Sets META tags (title). 
     */  
    ngOnInit() {
        this.seoService.setSeoByKeys('User.NewPasswordCreation', 'Slogan');
    }

    /**
     * Sends mail regarding lost password on form submit
     * @param {NgForm} form 
     */
    onSubmit(form: NgForm) {
        this.notificationsService.clearAlerts();
        this.isSubmitDisabled = true;

        this.forgottenPasswordSubscription = this.userService.forgotPass(form.value)
            .subscribe(() => {
                this.isSubmitDisabled = false;
                this.mailSent = true;
            });
    }

    /**
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy() {
        this.notificationsService.clearAlerts();

        if (this.forgottenPasswordSubscription)
            this.forgottenPasswordSubscription.unsubscribe();
    }
}
