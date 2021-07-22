import { Component, Inject, OnInit } from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { UserStateService } from '@app/services/user-state.service';
import { environment } from '@env/environment';

import { Observable, zip } from 'rxjs';
import { map } from 'rxjs/operators';

import { APP_CONFIG } from '@app/app.config';
import { UserService } from '@app/services/user.service';

import { User } from '@app/services/models';
import { UserDashboardData } from '@app/services/models/user-dashboard-data';
import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';
import { SeoService } from '@app/services/seo.service';
import { DiscourseService } from '@app/user/forum/discourse.service';
import { ForumTopicWithCategory } from '@app/user/forum/forum.enum';

@Component({
    selector: 'app-my-dashboard',
    templateUrl: './my-dashboard.component.html',
})
/**
 * Dashboard component
 */
export class MyDashboardComponent implements OnInit {
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

    /**
     * @ignore
     */
    constructor(private seoService: SeoService,
                private userService: UserService,
                private userStateService: UserStateService,
                private discourseService: DiscourseService,
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
}
