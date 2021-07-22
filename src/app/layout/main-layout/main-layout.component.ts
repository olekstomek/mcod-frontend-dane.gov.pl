import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { filter, take } from 'rxjs/operators';

import { RoutingHelper } from '@app/services/commons/routing-helper';


@Component({
    selector: 'app-main-layout',
    templateUrl: './main-layout.component.html'
})
export class MainLayoutComponent {

    isHomepage: boolean;

    /**
     * Checks wheater it is homepage or any other page
     * @param router
     * @param localize
     */
    constructor(private router: Router,
                private localize: LocalizeRouterService) {

        this.localize.hooks.initialized
            .pipe(take(1))
            .subscribe(() => {
                this.isHomepage = RoutingHelper.isHomePage(router.url);
            });

        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd)
            )
            .subscribe((event: NavigationEnd) => {
                this.isHomepage = RoutingHelper.isHomePage(event.url);
            });
    }
}
