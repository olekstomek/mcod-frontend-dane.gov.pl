import { Component, Input } from '@angular/core';
import { Router } from '@angular/router';

import { UserService } from '@app/services/user.service';
import { ObserveService } from '@app/services/observe.service';
import { NotificationsService } from '@app/services/notifications.service';

/**
 * Following component. Adds following functionality to specific resource type.
 * @example
 * <app-observe-button resource="dataset" [item]="item"></app-observe-button>
 */
@Component({
    selector: 'app-observe-button',
    templateUrl: './observe-button.component.html'
})
export class ObserveButtonComponent {

    /**
     * Resource Reference ('dataset', 'application', 'article')
     */
    @Input() resource: 'dataset' | 'application' | 'article';

    /**
     * For template reference only
     */
    @Input() item: any;

    /**
     * Disables item for the time of request. Prevents triggering event multiple times
     * @type {boolean}
     */
    isDisabled: boolean = false;

    /**
     * @ignore
     */
    constructor(private router: Router,
                private notificationsService: NotificationsService,
                public userService: UserService,
                private observeService: ObserveService) {
    }

    /**
     * Toggles following and sends appropriate request to Observe service
     * @param item
     */
    followItem(item: any) {
        let method = 'followOne';

        if (item.attributes.followed) {
            method = 'unfollowOne';
        }

        this.isDisabled = true;

        this.observeService[method](this.resource, item.id)
            .subscribe(success => {
                this.isDisabled = false;
                item.attributes.followed = !item.attributes.followed;
            }, error => {
                this.isDisabled = false;

                if (error.error.description) {
                    this.notificationsService.addError(error.error.description);
                } else if (error.message) {
                    this.notificationsService.addError(error.message);
                }

                if (error.status === 401) {
                    setTimeout(() => {
                        this.userService.logout();
                        this.router.navigate(['/user', 'login'], {queryParams: {'redirect': this.router.url}});
                    }, 1000);
                }
            });
    }

}
