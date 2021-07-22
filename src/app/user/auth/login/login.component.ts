import { Component, OnInit, OnDestroy } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { NgForm } from '@angular/forms';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { Subscription } from 'rxjs';

import { UserService } from '@app/services/user.service';
import { IErrorBackend } from '@app/services/models/error-backend';
import { SeoService } from '@app/services/seo.service';
import { NotificationsService } from '@app/services/notifications.service';
import { toggleVertically } from '@app/animations';

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
                private notificationsService: NotificationsService,
                private localizeRouterService: LocalizeRouterService) {
    }

    /**
     * Sets META tags (title).
     * Initializes redirection URL.
     * Gets Csrf token
     */
    ngOnInit() {
        this.seoService.setPageTitleByTranslationKey(['Action.Login']);
        this.redirectUrl = this.activeRoute.snapshot.queryParamMap.get('redirect');
        this.userService.getCsrfToken().subscribe();
    }

    /**
     * Redirects user on form submit
     * @param {NgForm} form
     */
    onSubmit(form: NgForm) {
        if (form.invalid) {
            return;
        }
        
        this.notificationsService.clearAlerts();
        this.redirectUrl = this.activeRoute.snapshot.queryParams.redirect;
        this.userService.login(form.value.email, form.value.password, !!form.value.rememberCheck)
            .subscribe(() => {
                if (this.redirectUrl) {
                    this.notificationsService.clearAlerts();
                    this.router.navigateByUrl(this.redirectUrl);
                } else {
                    this.router.navigate(this.localizeRouterService.translateRoute(['/!user', '!dashboard']) as []);
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
