import { Component } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';

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
     */
    constructor(private router: Router) {
        this.router.events
            .pipe(
                filter((event) => event instanceof NavigationEnd)
            )
            .subscribe((event: NavigationEnd) => {
                this.isHomepage = RoutingHelper.isHomePage(event.url);
            });
    }
}
