import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit } from '@angular/core';
import { APP_CONFIG } from '@app/app.config';
import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';
import { environment } from '@env/environment';

/**
 * Dashboard Component
 */
@Component({
    selector: 'app-dashboard',
    templateUrl: './dashboard.component.html',
})
export class DashboardComponent implements OnInit {
    /**
     * Is sidebar visible 
     */
    sidebarVisible = true;
    
    /**
     * Discourse forum url 
     */
    forumUrl: string;
    
    /**
     * @ignore
     */
    PermissionPerRoles: typeof PermissionPerRoles = PermissionPerRoles;
    
    /**
     * @ignore
     */
    constructor(@Inject(DOCUMENT) private document: Document) {
    }

    /**
     * Initializes forum url
     */
    ngOnInit() {
        const {protocol, hostname} = this.document.location;
        this.forumUrl = !environment.production ? APP_CONFIG.urls.forumInt : protocol + '//forum.' + hostname.replace('www.', '');
    }
}
