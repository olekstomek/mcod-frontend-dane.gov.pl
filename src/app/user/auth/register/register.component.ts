import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, OnDestroy } from '@angular/core';
import { Subscription } from 'rxjs';

import { UserService } from '@app/services/user.service';
import { IRegistration } from '@app/services/models';
import { IErrorBackend } from '@app/services/models/error-backend';
import { SeoService } from '@app/services/seo.service';
import { NotificationsService } from '@app/services/notifications.service';
import { toggleVertically } from '../../../animations/index';
import { equalValueValidator } from '../equal-value-validator';

/**
 * Register Component
 */
@Component({
    templateUrl: './register.component.html',
    animations: [
        toggleVertically
    ]
})
export class RegisterComponent implements OnInit, OnDestroy {
    /**
     * User subscription of register component
     */
    userSubscription: Subscription;

    /**
     * Registration form of register component
     */
    registrationForm: FormGroup;

    /**
     * Registration form errors of register component
     */
    formErrors: IErrorBackend;

    /**
     * Determines whether a user is registered
     */
    isRegistered: boolean = false;

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
                private seoService: SeoService,
                private userService: UserService,
                private notificationsService: NotificationsService) {
    }

    /**
     * Sets META tags (title). 
     * Initializes registration form and its validators.
     */   
    ngOnInit() {
        this.seoService.setSeoByKeys('Action.Register', 'Slogan');

        this.registrationForm = this.formBuilder.group({
                'email': ['', [Validators.required, Validators.email]],
                'password1': ['', [Validators.required, Validators.minLength(this.passwordMinLength)]],
                'password2': ['', Validators.required]
            },
            {validator: equalValueValidator('password1', 'password2')}
        );
    }

    /**
     * Registers a user on form submit. Clears API errors (if any).
     */
    onSubmit() {
        this.notificationsService.clearAlerts();
        const user: IRegistration = this.registrationForm.value as IRegistration;

        this.userSubscription = this.userService
            .registerUser(user)
            .subscribe(() => {
                this.isRegistered = true;
            });
    }

    /**
     * Determines whether form field is valid 
     * @param {string} field 
     * @returns {boolean} true if field valid 
     */
    isFieldValid(field: string): boolean {
        return !this.registrationForm.get(field).valid && this.registrationForm.get(field).touched;
    }

    /**
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy() {
        this.userSubscription && this.userSubscription.unsubscribe();
    }    
}
