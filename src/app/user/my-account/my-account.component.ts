import { Component, OnInit } from '@angular/core';

import { UserService } from '@app/services/user.service';
import { SeoService } from '@app/services/seo.service';
import { environment } from '@env/environment';

/**
 * My Account Component
 */
@Component({
    selector: 'app-my-account',
    templateUrl: './my-account.component.html'
})
export class MyAccountComponent implements OnInit {
    /**
     * Logged in user
     */
    user: any;

    /**
     * Token data of logged in user
     */
    tokenData: any;
    
    /**
     * Currently active (tab) container
     */
    activeContainer: number = 0;

    /**
     * Admin panel url
     */
    adminPanelUrl: string;

    /**
     * @ignore
     */
    constructor(private seoService: SeoService,
                private userService: UserService) {
    }

    /**
     * Sets META tags (title). 
     * Initializes loggen in user.
     */   
    ngOnInit() {
        this.seoService.setSeoByKeys('User.MyAccount', 'Slogan');
        this.adminPanelUrl = !environment.production ? 'http://admin.dev.dane.gov.pl' : document.location.protocol + '//admin.' + document.location.hostname.replace('www.', '');

        this.userService
            .getCurrentUser()
            .subscribe(user => {
                this.user = user;
                this.tokenData = this.userService.getTokenData();
            });
    }
}
