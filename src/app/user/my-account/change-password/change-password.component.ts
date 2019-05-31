import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Subscription } from 'rxjs';

import { equalValueValidator } from '@app/user/auth/equal-value-validator';
import { UserService } from '@app/services/user.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { IErrorBackend } from '@app/services/models/error-backend';
import { toggleVertically } from '../../../animations/index';

/**
 * Change Password Component
 */
@Component({
    selector: 'app-change-password',
    templateUrl: './change-password.component.html',
    animations: [
        toggleVertically
    ]
})
export class ChangePasswordComponent implements OnInit {
    /**
     * User subscription of change password component
     */
    userSubscription: Subscription;

    /**
     * Change password form of change password component
     */
    changePasswordForm: FormGroup;

    /**
     * Determines whether password has been changed
     */
    passwordChanged: boolean = false;

    /**
     * Change password form errors of change password component
     */
    formErrors: IErrorBackend;

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
                private notificationsService: NotificationsService,
                private userService: UserService,
                private seoService: SeoService) {
    }

    /**
     * Sets META tags (title). 
     * Initializes change password form and its validators.
     */   
    ngOnInit() {
        this.seoService.setSeoByKeys('User.PasswordChange', 'Slogan');

        this.changePasswordForm = this.formBuilder.group({
            'old_password': ['', Validators.required],
            'new_password1': ['', [Validators.required, Validators.minLength(8)]],
            'new_password2': ['', Validators.required]
            },
            {validator: equalValueValidator('new_password1', 'new_password2')}
        );
    }

    /**
     * Changes password on form submit. Clears API errors (if any).
     */
    onSubmit() {
        this.notificationsService.clearAlerts();

        this.userSubscription = this.userService
            .changePassword(this.changePasswordForm.value)
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
        return !this.changePasswordForm.get(field).valid && this.changePasswordForm.get(field).touched;
    }

    /**
     * Unsubscribes from existing subscriptions
     */
    onDestroy() {
        this.userSubscription && this.userSubscription.unsubscribe();
    }
}
