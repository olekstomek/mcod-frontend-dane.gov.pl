import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { Observable, Subject, zip } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';

import { APP_CONFIG } from '@app/app.config';
import { HighContrastModeEnum, HighContrastService } from '@app/services/high-contrast.service';
import { User } from '@app/services/models';
import { UserDashboardData } from '@app/services/models/user-dashboard-data';
import { SeoService } from '@app/services/seo.service';
import { UserStateService } from '@app/services/user-state.service';
import { UserService } from '@app/services/user.service';
import { ConfirmDialogService } from '@app/shared/confirm-dialog/confirm-dialog.service';
import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';
import { DiscourseService } from '@app/user/forum/discourse.service';
import { ForumTopicWithCategory } from '@app/user/forum/forum.enum';

@Component({
    selector: 'app-my-dashboard',
    templateUrl: './my-dashboard.component.html',
})
/**
 * Dashboard component
 */
export class MyDashboardComponent implements OnInit, OnDestroy {

    /**
     * Admin panel url
     */
    adminPanelUrl: string;

    /**
     * Discourse forum url
     */
    forumUrl: string;

    /**
     * Data required by dashboard child components
     */
    dashboardData$: Observable<{ user: User, data: UserDashboardData }>;

    /**
     * Determines whether current user is admin
     */
    isAdmin: boolean;

    /**
     * @ignore
     */
    PermissionPerRoles: typeof PermissionPerRoles = PermissionPerRoles;

    /**
     * Forum latest topics with categories
     */
    forumLatestTopicsWithCategories: ForumTopicWithCategory[];

    /**
     * Forum username
     */
    forumUsername: string;
    highContrastMode: HighContrastModeEnum;
    destroy$: Subject<boolean> = new Subject();

    constructor(private seoService: SeoService,
                private userService: UserService,
                private userStateService: UserStateService,
                private discourseService: DiscourseService,
                private dialog: ConfirmDialogService,
                private route: ActivatedRoute,
                private translateService: TranslateService,
                private highContrastService: HighContrastService,
                @Inject(DOCUMENT) private document: Document) {
    }

    /**
     * Sets access to admin panel
     * Initializes user permissions
     * Setups dashboard data
     * Setups forum notifications and latest topics
     */
    ngOnInit() {
      this.seoService.setPageTitleByTranslationKey(['MyDashboard.Self']);
      this.setAdminPanelUrl();
      this.setupDashboardData();
      this.setupForumData();
      this.isAdmin = this.userService.isAdmin();
      this.highContrastService.getCurrentContrastMode()
        .pipe(takeUntil(this.destroy$))
        .subscribe(mode => this.highContrastMode = mode);
    }

    /**
     * Sets admin panel url
     */
    private setAdminPanelUrl(): void {
        const {protocol, hostname} = this.document.location;
        this.adminPanelUrl = !environment.production ? APP_CONFIG.urls.adminPanelDev : protocol + '//admin.' + hostname.replace('www.', '');
        this.forumUrl = !environment.production ? APP_CONFIG.urls.forumInt : protocol + '//forum.' + hostname.replace('www.', '');
    }

    /**
     * Combines data needed by template
     */
    private setupDashboardData(): void {
        this.dashboardData$ = zip(
            this.userStateService.getCurrentUser(),
            this.userService.getUserDashboardData())
            .pipe(map(([user, data]) => ({user, data})));
    }

    /**
     * Setups forum data
     */
    private setupForumData() {
        if (!this.userService.getTokenData().user.discourse_user_name) {
            return;
        }

        this.forumUsername = this.userService.getTokenData().user.discourse_user_name;
        this.discourseService.getLatestTopicsWithCategories().subscribe(latestTopics => {
            this.forumLatestTopicsWithCategories = latestTopics;
        });
    }

    linkAccountToWK() {
      if (environment.production) {
        const currentUrl = this.document.location.hostname.replace('www.', '');
        window.location.href = `https://admin.${currentUrl}/logingovpl`;
      } else {
        window.location.href = `https://admin.mcod.local/logingovpl`;
      }
    }

    unlinkAccountFromWK() {
      if (environment.production) {
        const currentUrl = this.document.location.hostname.replace('www.', '');
        window.location.href = `https://admin.${currentUrl}/logingovpl/unlink`;
      } else {
        window.location.href = `https://admin.mcod.local/logingovpl/unlink`;
      }
    }

    openDialog() {
      const options = {
        title: this.translateService.instant('MyDashboard.Dialog.Title'),
        message: '',
        confirmText: this.translateService.instant('MyDashboard.Dialog.Confirm'),
        cancelText: this.translateService.instant('MyDashboard.Dialog.Cancel'),
      };

      this.dialog.open(options);

      this.dialog.confirmed().subscribe(confirmed => {
        if (confirmed) {
          this.unlinkAccountFromWK();
        }
      });
    }

    ngOnDestroy() {
      this.destroy$.next(true);
      this.destroy$.complete();
    }
}
