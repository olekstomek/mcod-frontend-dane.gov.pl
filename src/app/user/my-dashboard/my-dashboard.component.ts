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
import { ForumService } from '@app/user/forum/forum.service';
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
     * Data required by dashboard child components
     */
    dashboardData$: Observable<{ user: User, data: UserDashboardData }>;

    /**
     * Determines whether current user is admin
     */
    isAdmin: boolean;

    /**
     * Temp forum list items
     */
    tempForumList = [
        {
            title: 'At rem eos doloribus officia id cum pariatur iusto sit omnis iste.',
            answers: 10,
            views: 10,
            activities: 10,
            type: 'Zbiory danych',
            type_color: '#f93'
        },
        {
            title: 'Lorem, ipsum dolor sit amet consectetur adipisicing elit.',
            answers: 10,
            views: 10,
            activities: 10,
            type: 'Zespół',
            type_color: '#39c'
        },
        {
            title: 'Impedit laboriosam odio maxime fugit reiciendis maiores sunt. Deleniti iusto suscipit magni voluptatem beatae, fugiat nostrum nisi?',
            answers: 10,
            views: 10,
            activities: 10,
            type: 'Zbiory danych',
            type_color: '#393'
        }
    ]

    /**
     * @ignore
     */
    PermissionPerRoles: typeof PermissionPerRoles = PermissionPerRoles;

    /**
     * Forum latest topics with categories
     */
    forumLatestTopicsWithCategories: ForumTopicWithCategory[];

    /**
     * @ignore
     */
    constructor(private seoService: SeoService,
                private userService: UserService,
                private userStateService: UserStateService,
                private forumService: ForumService,
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
        this.forumService.getLatestTopicsWithCategories().subscribe(latestTopics => {
            this.forumLatestTopicsWithCategories = latestTopics;
        });
    }
}
