import {HttpClient, HttpErrorResponse, HttpHeaders} from '@angular/common/http';
import {Inject, Injectable, PLATFORM_ID} from '@angular/core';
import {DOCUMENT} from '@angular/platform-browser';
import {Router} from '@angular/router';
import {LocalStorageService} from 'ngx-localstorage';
import {TranslateService} from '@ngx-translate/core';
import {CookieService} from 'ngx-cookie-service';
import {Observable, throwError} from 'rxjs';
import {catchError} from 'rxjs/operators';
import * as jwt from 'jsonwebtoken';
import moment from 'moment';

import {environment} from '@env/environment';
import {NotificationsService} from '@app/services/notifications.service';
import {UserToken} from '@app/services/models/user-token';


/**
 * Parent service for each api service that handles underlying requirements
 */
@Injectable()
export abstract class RestService {

    public base_url: string;
    public token: string;
    private cookie_domain: string;
    private sessionExpires;
    private apiVersion = '1.0';
    private prefix = '';

    /**
     * Dependency injection required for api calls, and base_url setup
     * @param {HttpClient} http
     * @param {TranslateService} translate
     * @param {Router} router
     * @param {NotificationsService} notificationService
     * @param {LocalStorageService} storageService
     * @param {CookieService} cookieService
     * @param document
     * @param {string} platformId
     */
    constructor(protected http: HttpClient,
                private translate: TranslateService,
                private router: Router,
                private notificationService: NotificationsService,
                private storageService: LocalStorageService,
                private cookieService: CookieService,
                @Inject(DOCUMENT) private document: any,
                @Inject(PLATFORM_ID) private platformId: string) {
        if (!environment.production) {
            this.base_url = '/api';
            this.cookie_domain = 'localhost';
        } else {
            this.base_url = this.document.location.protocol + '//api.' + this.document.location.hostname.replace('www.', '');
            this.cookie_domain = '.' + this.document.location.hostname.replace('www.', '');
        }

        const regex = /^(\w*)\.?dane\.gov\.pl$/gi;
        const prefixArr = regex.exec(this.document.location.hostname.replace('www.', ''));

        this.prefix = (prefixArr && prefixArr[1]) ? `${prefixArr[1]}_` : '';
        this.initHeaders();
    }

    private _headers: HttpHeaders;

    /**
     * Access to headers to child services
     * @returns {HttpHeaders}
     */
    protected get headers(): HttpHeaders {
        return this._headers;
    }

    /**
     * Allow overwriting headers from child services
     * @param {HttpHeaders} value
     */
    protected set headers(value: HttpHeaders) {
        this._headers = value;
    }

    /**
     * Setup language calls
     * @param {string} language
     */
    public setLang(language: string) {
        this._headers = this._headers.append('Accept-Language', language);
    }

    /**
     * Setup token, save it in browser and setup admin user cookie
     * @param {string} token
     * @param {boolean} remember
     */
    setToken(token: string, remember: boolean = false) {
        this.token = token;

        const jwtData: any = jwt.decode(this.token);

        if (jwtData.user && jwtData.user.session_key) {
            this.cookieService.set(`${this.prefix}sessionid`, jwtData.user.session_key,
                new Date(jwtData.exp * 1000), '/', this.cookie_domain);
        }
        this.cookieService.set(`${this.prefix}mcod_token`, token, new Date(jwtData.exp * 1000), '/', this.cookie_domain);
        this.storageService.set('remember', remember ? '1' : '0');
    }

    /**
     * Get token if available, and validate expiration date
     * @returns {string}
     */
    getToken(): string {
        this.token = this.cookieService.get(`${this.prefix}mcod_token`);
        if (this.token) {
            const remember: boolean = Boolean(+this.storageService.get('remember'));
            this.sessionExpires = this.getTokenData().exp;
            const currentTime: number = moment().unix();
            if (remember && this.getTokenData().exp > currentTime) {
                return this.token;
            }
            if (!remember && this.getTokenData().iat + (3600 * 12) > currentTime) {
                return this.token;
            }
            this.token = null;
        }
        return this.token;
    }

    /**
     * Decode JWT Token and provide its data
     * @returns {any}
     */
    public getTokenData(): UserToken {
        return <UserToken>jwt.decode(this.token);
    }

    /**
     * Clear any session traces, remove jwt token and session cookie
     */
    clearToken() {
        this.token = null;
        this.storageService.remove('remember');
        this.cookieService.delete(`${this.prefix}mcod_token`, '/', this.cookie_domain);
        this.cookieService.delete(`${this.prefix}sessionid`, '/', this.cookie_domain);
    }

    /**
     * Overridable GET Method Api call
     * @param {string} relativeUrl
     * @param params
     * @returns {Observable<any>}
     */
    protected get(relativeUrl: string, params?: any): Observable<any> {
        return this.request('get', this.base_url + relativeUrl, params);
    }

    /**
     * Overridable DELETE Method Api Call
     * @param {string} relativeUrl
     * @param params
     * @returns {Observable<any>}
     */
    protected delete(relativeUrl: string, params?: any): Observable<any> {
        return this.request('delete', this.base_url + relativeUrl, params);
    }

    /**
     * Overridable POST Method API Call
     * @param {string} relativeUrl
     * @param payload
     * @param params
     * @returns {Observable<any>}
     */
    protected post(relativeUrl: string, payload?: any, params?: any): Observable<any> {
        return this.requestWithPayload('post', this.base_url + relativeUrl, payload, params);
    }

    /**
     * Overridable PUT Method Api Call
     * @param {string} relativeUrl
     * @param payload
     * @param params
     * @returns {Observable<any>}
     */
    protected put(relativeUrl: string, payload?: any, params?: any): Observable<any> {
        return this.requestWithPayload('put', this.base_url + relativeUrl, payload, params);
    }

    /**
     * Basic Api Call method without payload
     * @param {"get" | "delete"} method
     * @param url
     * @param params
     * @returns {Observable<any>}
     */
    protected request(method: 'get' | 'delete', url, params?: any): Observable<any> {
        this.initHeaders();

        return this.http[method](url, {
            headers: this.headers,
            params: params
        }).pipe(
            catchError(this.errorRedirectionHandler.bind(this))
        );
    }

    /**
     * Basic Api Call method with payload
     * @param {"post" | "put"} method
     * @param url
     * @param payload
     * @param params
     * @returns {Observable<any>}
     */
    protected requestWithPayload(method: 'post' | 'put', url, payload?: any, params?: any): Observable<any> {
        this.initHeaders();

        return this.http[method](url, payload, {
            headers: this.headers,
            params: params
        }).pipe(
            catchError(this.errorNotificationHandler.bind(this))
        );
    }

    /**
     * Check if session is active i.e. if user is logged in
     * @returns {boolean}
     */
    protected checkSession() {
        const token: string = this.getToken();
        if (token) {
            this.token = token;
            this._headers = this._headers.append('Authorization', 'Bearer ' + token);
            return true;
        }
        this._headers = this._headers.delete('Authorization');
        return false;
    }

    /**
     * Global error handler for all API calls
     * Here 404 redirection is created for GET Methods
     * @param {HttpErrorResponse} err
     * @returns {ErrorObservable}
     */
    protected errorRedirectionHandler(err: HttpErrorResponse) {
        if (err.status === 404) {
            this.router.navigate(['/404']);
            return throwError(err);
        }
        return this.errorNotificationHandler(err);
    }

    /**
     * Global error handler for all API calls
     * Here notifications are created
     * @param {HttpErrorResponse} err
     * @returns {ErrorObservable}
     */
    protected errorNotificationHandler(err: HttpErrorResponse) {
        if (err.error && err.error.description) {
            let msg = err.error.description;
            if (err.error.errors) {
                msg += ': ';
                for (const param in err.error.errors) {
                    if (err.error.errors[param]) {
                        const field = err.error.errors[param];
                        msg += field.join(', ').toLowerCase();
                    }
                }
            }

            msg += '. ';
            this.notificationService.addError(msg);
        } else if (err.message) {
            this.notificationService.addError(err.message);
        }
        return throwError(err);
    }

    /**
     * Initial headers setup, creates headers, checks active sessions, and sets browser's active language
     */
    private initHeaders() {
        this._headers = new HttpHeaders();
        this._headers = this._headers.append('X-API-VERSION', this.apiVersion);
        this.checkSession();
        this.setLang(this.translate.currentLang);
    }

}
