import { Injectable} from '@angular/core';
import { defer, Observable, ReplaySubject } from 'rxjs';
import { filter, switchMap, take} from 'rxjs/operators';

import { FeatureFlagService } from '@app/services/feature-flag.service';
import { LoginService } from '@app/services/login-service';
import { User } from '@app/services/models';
import { IFeatureFlag } from '@app/services/models/feature-flag';
import { UserService } from '@app/services/user.service';

/**
 * User State Service
 */
@Injectable({
    providedIn: 'root'
})
export class UserStateService {

    /**
     * Current user
     * @type {User}
     */
    private currentUser: User;

    /**
     * Determines if data is fetching
     * @type {boolean}
     */
    private isFetching: boolean = false;

    /**
     * Current user
     * @type {ReplaySubject<User>}
     */
    private currentUser$: ReplaySubject<User> = new ReplaySubject<User>(1);

    /**
     * @ignore
     */
    constructor(private readonly userService: UserService,
                private readonly loginService: LoginService,
                private readonly featureFlagService: FeatureFlagService) {
    }


    /**
     * Gets current user from API when state is empty or needs revalidate
     * @returns {Observable<User>}
     */
    getCurrentUser(): Observable<User> {
        return this.featureFlagService.featureFlags
            .pipe(
                switchMap((flagList: IFeatureFlag[]) => {
                const isEnabled = this.featureFlagService.validateFlag('S18_userState.fe', flagList);
                if (isEnabled) {
                    return defer(() => {
                        this.userService.getToken();
                        if (this.currentUser && this.currentUser.attributes.email !== this.userService.getTokenData().user.email) {
                            this.clearCurrentUser();
                        }
                        if (!this.currentUser && !this.isFetching) {
                            this.isFetching = true;
                            this.userService.getCurrentUser()
                                .pipe(
                                    take(1)
                                ).subscribe(
                                user => {
                                    this.isFetching = false;
                                    this.setCurrentUser(user);
                                },
                                () => {
                                    this.isFetching = false;
                                    this.clearCurrentUser();
                                }
                            );
                        }
                        return this.currentUser$
                            .asObservable()
                            .pipe(
                                filter(user => user !== null))
                    });
                }
                return this.userService.getCurrentUser();
            }));

    }

    /**
     * Sets current user
     * @param user
     */
    setCurrentUser(user: User): void {
        const userCopy = Object.assign({}, user);
        this.currentUser = userCopy;
        this.currentUser$.next(userCopy);
    }

    /**
     * Clears current user
     */
    clearCurrentUser(): void {
        this.currentUser = null;
        this.currentUser$.next(null);
    }

}
