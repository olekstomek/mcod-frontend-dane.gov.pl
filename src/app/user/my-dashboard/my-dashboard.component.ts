import { AsyncPipe, DOCUMENT, LowerCasePipe, NgFor, NgIf } from '@angular/common';
import { Component, inject, OnDestroy, OnInit } from '@angular/core';
import { ActivatedRoute, RouterLink } from '@angular/router';
import { environment } from '@env/environment';
import { LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { Observable, Subject, zip } from 'rxjs';
import { map, takeUntil } from 'rxjs/operators';
import { LogingovplNotificationComponent } from '../logingovpl/logingovpl-notification/logingovpl-notification.component';
import { ScheduleNotificationPopupComponent } from '../schedule/schedule-notification-popup/schedule-notification-popup.component';

import { APP_CONFIG } from '@app/app.config';
import { HighContrastModeEnum, HighContrastService } from '@app/services/high-contrast.service';
import { User } from '@app/services/models';
import { UserDashboardData } from '@app/services/models/user-dashboard-data';
import { SeoService } from '@app/services/seo.service';
import { UserStateService } from '@app/services/user-state.service';
import { UserService } from '@app/services/user.service';
import { ConfirmDialogService } from '@app/shared/confirm-dialog/confirm-dialog.service';
import { LoaderComponent } from '@app/shared/loader/loader.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { TimespanPipe } from '@app/shared/pipes/timespan.pipe';
import { TranslateDateFormatPipe } from '@app/shared/pipes/translate-date-format.pipe';
import { PermissionDirective } from '@app/shared/user-permissions/permission.directive';
import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';
import { DiscourseService } from '@app/user/forum/discourse.service';
import { ForumTopicWithCategory } from '@app/user/forum/forum.enum';
import { FavoriteDatasetsTileComponent } from '@app/user/favorites/tile/favorite-datasets-tile.component';

@Component({
  selector: 'app-my-dashboard',
  templateUrl: './my-dashboard.component.html',
  standalone: true,
  imports: [
    NgIf,
    LogingovplNotificationComponent,
    PermissionDirective,
    RouterLink,
    ScheduleNotificationPopupComponent,
    NgFor,
    LoaderComponent,
    NotificationsServerComponent,
    AsyncPipe,
    LowerCasePipe,
    LocalizeRouterPipe,
    TranslatePipe,
    TimespanPipe,
    TranslateDateFormatPipe,
    FavoriteDatasetsTileComponent,
  ],
})
/**
 * Dashboard component
 */
export class MyDashboardComponent implements OnInit, OnDestroy {
  private readonly seoService = inject(SeoService);
  private readonly userService = inject(UserService);
  private readonly userStateService = inject(UserStateService);
  private readonly discourseService = inject(DiscourseService);
  private readonly dialog = inject(ConfirmDialogService);
  private readonly route = inject(ActivatedRoute);
  private readonly translateService = inject(TranslateService);
  private readonly highContrastService = inject(HighContrastService);
  private readonly document = inject(DOCUMENT);

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
  dashboardData$: Observable<{ user: User; data: UserDashboardData }>;

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
  destroy$ = new Subject<boolean>();

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
    this.highContrastService
      .getCurrentContrastMode()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mode) => (this.highContrastMode = mode));
  }

  /**
   * Sets admin panel url
   */
  private setAdminPanelUrl(): void {
    const { protocol, hostname } = this.document.location;
    this.adminPanelUrl = !environment.production
      ? APP_CONFIG.urls.adminPanelDev
      : protocol + '//admin.' + hostname.replace('www.', '');
    this.forumUrl = !environment.production
      ? APP_CONFIG.urls.forumInt
      : protocol + '//forum.' + hostname.replace('www.', '');
  }

  /**
   * Combines data needed by template
   */
  private setupDashboardData(): void {
    this.dashboardData$ = zip(this.userStateService.getCurrentUser(), this.userService.getUserDashboardData()).pipe(
      map(([user, data]) => ({ user, data })),
    );
  }

  /**
   * Setups forum data
   */
  private setupForumData() {
    if (!this.userService.getTokenData().user.discourse_user_name) {
      return;
    }

    this.forumUsername = this.userService.getTokenData().user.discourse_user_name;
    this.discourseService.getLatestTopicsWithCategories().subscribe((latestTopics) => {
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

    this.dialog.confirmed().subscribe((confirmed) => {
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
