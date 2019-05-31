import { Injectable } from '@angular/core';
import { HttpHeaders, HttpParams } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { map, publishReplay, refCount, finalize } from 'rxjs/operators';
import * as _ from 'underscore';

import { User, IRegistration } from '@app/services/models';
import { RestService } from '@app/services/rest.service';
import { ApiConfig } from '@app/services/api';

/**
 * Auth and user service. Handles API communication on user level.
 */
@Injectable()
export class UserService extends RestService {

    public redirectUrl: string;
    private userId: number;
    private loginSource = new BehaviorSubject<boolean>(!!this.token);
    public readonly loggedIn = this.loginSource.asObservable();

    /**
     * Registers user.
     * @param {IRegistration} user
     * @returns {Observable<any>}
     */
    public registerUser(user: IRegistration) {
        this.headers = new HttpHeaders();
        return this.post(ApiConfig.userRegistration, user);
    }

    /**
     * Ask API to send another confirmation email in case if previous one did not arrive.
     * @param {string} email
     * @returns {Observable<any>}
     */
    public resendConfirmationEmail(email: string) {
        this.headers = new HttpHeaders();
        return this.post(ApiConfig.userResendEmail, {email: email});
    }

    /**
     * Send email verification request with specified token
     * @param {string} token
     * @returns {Observable<any>}
     */
    public verifyEmail(token: string) {
        this.headers = new HttpHeaders();
        const url = ApiConfig.userVerifyEmail + `/${token}`;
        return this.get(url);
    }

    /**
     * Asks API to send email with password reset link
     * @param {{email: string}} model
     * @returns {Observable<any>}
     */
    public forgotPass(model: { email: string }) {
        this.headers = new HttpHeaders();
        return this.post(ApiConfig.userResetPass, model);
    }

    /**
     * Send new passwords with given reset pass token
     * @param {string} token
     * @param model
     * @returns {Observable<any>}
     */
    public resetPass(token: string, model: {
        new_password1: string,
        new_password2: string
    }) {
        this.headers = new HttpHeaders();
        const url = ApiConfig.userResetPass + `/${token}`;
        return this.post(url, model);
    }

    /**
     * Login user request
     * On success, saves token in browser data and sets up headers for further requests
     * @param {string} email
     * @param {string} pass
     * @param {boolean} remember
     * @returns {Observable<User>}
     */
    public login(email: string, pass: string, remember: boolean = true): Observable<User> {
        this.headers = new HttpHeaders();

        return new Observable(observer => {
            this.post(ApiConfig.userLogin, {
                email: email,
                password: pass
            }).pipe(
                map(response => response.data)
            )
                .subscribe(data => {
                    this.loginSource.next(true);
                    this.userId = data.id;
                    this.setToken(data.attributes.token, remember);
                    this.setupHeaders(this.token);
                    observer.next(data as User);
                    observer.complete();
                }, error => observer.error(error));
        });
    }

    /**
     * Change passoword call for logged in user
     * @returns {Observable<any>}
     * @param model
     */
    public changePassword(model: {
        old_password: string,
        new_password1: string,
        new_password2: string
    }) {
        this.setupHeaders(this.token, true);
        return this.post(ApiConfig.userChangePass, model);
    }

    /**
     * Logs out user and clears any session tokens
     * @returns {Observable<any>}
     */
    public logout() {
        return this.post(ApiConfig.userLogout)
            .pipe(
                finalize(() => {
                this.clearToken();
                this.loginSource.next(false);
            }));
    }

    /**
     * Get user profile data
     * @returns {Observable<User>}
     */
    public getCurrentUser(): Observable<User> {

        return new Observable(
            observer => {
                this.get(ApiConfig.userProfile)
                    .pipe(map(response => {
                        return response.data as User;
                    }))
                    .subscribe((data) => {
                        this.userId = data.id;
                        this.loginSource.next(true);
                        observer.next(data);
                        observer.complete();
                    }, error => {
                        this.loginSource.next(false);
                        observer.error(error);
                    });
            });
    }

    /**
     * Set up headers for user calls, that have different data format
     * @param {string} token
     * @param {boolean} isJSON
     */
    protected setupHeaders(token: string, isJSON: boolean = false) {
        let headers = new HttpHeaders();
        headers = headers.append('Authorization', 'Bearer ' + token);
        if (!isJSON)
            headers = headers.append('Content-Type', 'application/x-www-form-urlencoded');
        else
            headers = headers.append('Content-Type', 'application/json');

        this.headers = headers;
    }

    // Following


    /**
     * Get history of changes that user was author of
     * @param {number} page
     * @returns {any}
     */
    public getChangeHistory(page: number = 1) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('change_user_id', this.userId.toString());
        httpParams = httpParams.append('page', page.toString());
        httpParams = httpParams.append('sort', '-change_timestamp');
        httpParams = httpParams.append('per_page', '10');

        return this.get(ApiConfig.history, httpParams).pipe(
            publishReplay(1),
            refCount()
        );
    }

    /**
     * Get history of changes done to current user
     * @param {number} page
     * @returns {any}
     */
    public getUserHistory(page: number = 1) {
        let httpParams = new HttpParams();
        httpParams = httpParams.append('table_name', 'user');
        httpParams = httpParams.append('row_id', this.userId.toString());
        httpParams = httpParams.append('page', page.toString());
        httpParams = httpParams.append('sort', '-change_timestamp');
        httpParams = httpParams.append('per_page', '10');

        return this.get(ApiConfig.history, httpParams)
            .pipe(
                publishReplay(1),
                refCount()
            );
    }


    /**
     * Get history of changes to followed items
     * @param {number} page
     * @returns {Observable<any>}
     */
    getFollowedHistory(page: number = 1) {
        return new Observable<any>((subscriber => {

            this.get(ApiConfig.followedDatasets)
                .subscribe(result => {
                    const followedDatasets: number[] = _.pluck(result.data, 'id');
                    if (followedDatasets.length > 0) {

                        let httpParams = new HttpParams();
                        httpParams = httpParams.append('table_name', 'dataset');
                        httpParams = httpParams.append('row_id__in', followedDatasets.join('|'));
                        httpParams = httpParams.append('page', page.toString());
                        httpParams = httpParams.append('sort', '-change_timestamp');
                        httpParams = httpParams.append('per_page', '10');

                        this.get(ApiConfig.history, httpParams)
                            .subscribe(history => {
                                subscriber.next(history);
                                subscriber.complete();
                            });
                    } else {
                        subscriber.complete();
                    }

                });
        }));
    }
}
