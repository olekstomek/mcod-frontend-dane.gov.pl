import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, Router } from '@angular/router';
import { environment } from '@env/environment';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { toggleVertically } from '@app/animations';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { HighContrastModeEnum, HighContrastService } from '@app/services/high-contrast.service';
import { IErrorBackend } from '@app/services/models/error-backend';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { UserService } from '@app/services/user.service';

/**
 * Login Component
 */
@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  animations: [toggleVertically],
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
   * Toggle for login view
   */
  isEmailLoginChoose = false;
  highContrastMode: HighContrastModeEnum;
  destroy$: Subject<void> = new Subject<void>();

  /**
   * @ignore
   */
  constructor(
    private router: Router,
    private activeRoute: ActivatedRoute,
    private userService: UserService,
    private seoService: SeoService,
    private notificationsService: NotificationsService,
    private localizeRouterService: LocalizeRouterService,
    public featureFlagsService: FeatureFlagService,
    private highContrastService: HighContrastService,
    @Inject(DOCUMENT) private document: Document
  ) {}

  /**
   * Sets META tags (title).
   * Initializes redirection URL.
   * Gets Csrf token
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Action.Login']);
    this.redirectUrl = this.activeRoute.snapshot.queryParamMap.get('redirect');
    this.userService.getCsrfToken().subscribe();
    this.highContrastService.getCurrentContrastMode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(mode => this.highContrastMode = mode);
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
    this.userService.login(form.value.email, form.value.password, !!form.value.rememberCheck).subscribe(() => {
      if (this.redirectUrl) {
        this.notificationsService.clearAlerts();
        this.router.navigateByUrl(this.redirectUrl);
      } else {
        this.router.navigate(this.localizeRouterService.translateRoute(['/!user', '!dashboard']) as []);
      }
    });
  }

  chooseEmailLogin() {
    this.isEmailLoginChoose = true;
  }

  returnToLoginMethod() {
    this.isEmailLoginChoose = false;
  }

  loginViaWk() {
    if (environment.production) {
      const currentUrl = this.document.location.hostname.replace('www.', '');
      window.location.href = `https://admin.${currentUrl}/logingovpl`;
    } else {
      window.location.href = `https://admin.mcod.local/logingovpl`;
    }
  }

  /**
   * Unsubscribes from existing subscriptions
   */
  ngOnDestroy() {
    if (this.userSubscription) {
      this.userSubscription.unsubscribe();
    }
    this.destroy$.next();
    this.destroy$.complete();
  }
}
