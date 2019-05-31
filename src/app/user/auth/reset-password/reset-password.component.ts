import { Component, OnInit, OnDestroy } from '@angular/core';
import { FormBuilder, FormGroup, Validators, NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { Subscription } from 'rxjs';

import { equalValueValidator } from '@app/user/auth/equal-value-validator';
import { UserService } from '@app/services/user.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { toggleVertically } from '../../../animations/index';

/**
 * Reset Password Component
 */
@Component({
    selector: 'app-reset-password',
    templateUrl: './reset-password.component.html',
    animations: [
        toggleVertically
    ]
})
export class ResetPasswordComponent implements OnInit, OnDestroy {
    /**
     * User subscription of reset password component
     */
    userSubscription: Subscription;

    /**
     * Reset password form of reset password component
     */
    resetPasswordForm: FormGroup;
    /**
     * Token form received email
     */
    token: string;

    /**
     * Determines whether password  has been changed
     */
    passwordChanged: boolean = false;

    /**
     * Determines password min length
     */
    passwordMinLength = 8;

    /**
     * Determines whether to show password hint 
     */
    showPasswordHint: boolean = false;

    /**
     * @ignore
     */
    constructor(private formBuilder: FormBuilder,
                private route: ActivatedRoute,
                private notificationsService: NotificationsService,
                private userService: UserService,
                private seoService: SeoService) {
    }

    /**
     * Sets META tags (title). 
     * Initializes reset password form and its validators.
     */   
    ngOnInit() {
        this.seoService.setSeoByKeys('User.NewPasswordCreation', 'Slogan');
        this.token = this.route.snapshot.paramMap.get('token');

        this.resetPasswordForm = this.formBuilder.group({
                'new_password1': ['', [Validators.required, Validators.minLength(8)]],
                'new_password2': ['', Validators.required]
            },
            {validator: equalValueValidator('new_password1', 'new_password2')}
        );
    }

    /**
     * Stores token of token form submit
     * @param {NgForm} tokenForm 
     */
    onSubmitTokenForm(tokenForm: NgForm) {
        this.token = tokenForm.value.code;
    }

    /**
     * Resets password on reset password form submit. Clears API errors (if any).
     */
    onSubmitNewPassword() {
        this.notificationsService.clearAlerts();

        this.userSubscription = this.userService
            .resetPass(this.token, this.resetPasswordForm.value)
            .subscribe(() => {
                this.passwordChanged = true;
            });
    }

    /**
     * Determines whether form field is valid 
     * @param {string} field 
     * @returns {boolean} true if field valid 
     */
    isFieldValid(field: string): boolean {
        return !this.resetPasswordForm.get(field).valid && this.resetPasswordForm.get(field).touched;
    }

    /**
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy() {
        this.userSubscription && this.userSubscription.unsubscribe();
    }
}

