import { Injectable } from '@angular/core';
import { CanActivate, ActivatedRouteSnapshot, RouterStateSnapshot, Router } from '@angular/router';
import { Observable } from 'rxjs';

import { UserService } from '@app/services/user.service';

/**
 * Auth Guard
 */
@Injectable()
export class AuthGuard implements CanActivate {

    /**
     * @ignore
     */
    constructor(private userService: UserService, private router: Router) {
    }

    /**
     * Determines whether route can be activated
     * @param {ActivatedRouteSnapshot} next 
     * @param {RouterStateSnapshot} state 
     * @returns {Observable<boolean>} activate 
     */
    canActivate(next: ActivatedRouteSnapshot, state: RouterStateSnapshot): Observable<boolean> | Promise<boolean> | boolean {
        this.userService.getCurrentUser();
        return this.checkLogin(state.url);
    }

    /**
     * Checks login for specified url and redirects user
     * @param {string} url 
     * @returns {Observable<boolean>} login 
     */
    checkLogin(url: string): Observable<boolean> {

        // Store the attempted URL for redirecting
        this.userService.redirectUrl = url;

        // Navigate to the login page with extras
        return new Observable(observer => {
            this.userService
                .getCurrentUser()
                .subscribe(data => {

                if (!data) {
                    this.router.navigate(['/user', 'login']);
                    observer.next(false);
                } else {
                    observer.next(true);
                }
                observer.complete();
            }, () => {
                this.router.navigate(['/user', 'login']);
                observer.next(false);
            });
        });
    }
}
