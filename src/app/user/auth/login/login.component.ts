import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';

import { UserService } from '@app/services/user.service';
import { IErrorBackend } from '@app/services/models/error-backend';
import { SeoService } from '@app/services/seo.service';
import { NotificationsService } from '@app/services/notifications.service';
import { toggleVertically } from '../../../animations/index';

/**
 * Login Component
 */
@Component({
    selector: 'app-login',
    templateUrl: './login.component.html',
    animations: [
        toggleVertically
    ]
})
export class LoginComponent implements OnInit, OnDestroy {
    /**
     * User subscription of login component
     */
    userSubscription: Subscription;

    /**
     * Login error
     */
    error: IErrorBackend;

    /**
     * Redirect url on login error
     */
    redirectUrl: string;


    /**
     * @ignore
     */
    constructor(private router: Router,
                private activeRoute: ActivatedRoute,
                private userService: UserService,
                private seoService: SeoService,
                private notificationsService: NotificationsService) {
    }

    /**
     * Sets META tags (title). 
     * Initializes redirection URL.
     */  
    ngOnInit() {
        this.seoService.setSeoByKeys('Action.Login', 'Slogan');
        this.redirectUrl = this.activeRoute.snapshot.queryParamMap.get('redirect');
    }

    /**
     * Redirects user on form submit
     * @param {NgForm} form 
     */
    onSubmit(form: NgForm) {
        this.notificationsService.clearAlerts();
        this.userService
            .login(form.value.email, form.value.password, form.value.rememberCheck)
            .subscribe(() => {
                if (this.redirectUrl) {
                    this.router.navigateByUrl(this.redirectUrl);
                } else {
                    this.router.navigate(['/user', 'myaccount']);
                }
            });
    }

    /**
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy() {
        this.userSubscription && this.userSubscription.unsubscribe();
    }
}
