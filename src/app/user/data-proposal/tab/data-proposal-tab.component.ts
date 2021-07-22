import { Component, Input, OnDestroy } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Subscription } from 'rxjs';

/**
 * Data Proposal Tab Component
 */
@Component({
    selector: 'app-data-proposal-tab',
    templateUrl: './data-proposal-tab.component.html',
})
export class DataProposalTabComponent implements OnDestroy {

    /**
     * Type of data proposal
     */
    @Input()
    type: string;

    /**
     * Determines if current route has child
     */
    hasChildRoute: boolean;

    private routerEvents$: Subscription;

    constructor(public readonly activeRoute: ActivatedRoute,
                private readonly router: Router) {
        this.routerEvents$ = this.router.events
            .pipe(filter(event => event instanceof NavigationEnd))
            .subscribe(() => {
                this.hasChildRoute = this.activeRoute.children.length > 0;
            });
    }

    /**
     * Clean subscriptions
     */
    ngOnDestroy() {
        this.routerEvents$.unsubscribe();
    }
}
