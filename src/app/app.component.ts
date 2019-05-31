import { APP_CONFIG } from '@app/app.config';
import { ActivatedRoute, NavigationEnd, NavigationStart, Router } from '@angular/router';
import { Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { isPlatformBrowser, PlatformLocation, DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';


/**
 * Application Root Component
 */
@Component({
    selector: 'app-root',
    templateUrl: './app.component.html'
})
export class AppComponent implements OnInit {

    isEmbedded: boolean;
    isHomepage: boolean;
    isMyAccount: boolean;

    private isBackState: boolean = false;

    /**
     * @ignore
     */
    constructor(private renderer: Renderer2,
                private activatedRoute: ActivatedRoute,
                private location: PlatformLocation,
                private router: Router,
                private translate: TranslateService,
                @Inject(DOCUMENT) private document: string,
                @Inject(PLATFORM_ID) private platformId: string) {

    }

    /**
     * Navigation checks and default language setting
     */
    ngOnInit() {
        this.router.events
            .subscribe(event => {

                if (event instanceof NavigationStart) {
                    this.isEmbedded = (event.url.indexOf('/embed') !== -1) ? true : false;
                    this.isMyAccount = (event.url.indexOf('myaccount') !== -1) ? true : false;
                }

                if (event instanceof NavigationEnd) {
                    this.isHomepage = (event.url.length !== 1) ? false : true;
                    (!this.isMyAccount && !this.isEmbedded) && this.scrollTop();
                }
            });

        this.location.onPopState(() => {
            this.isBackState = true;
        });


        if (isPlatformBrowser(this.platformId)) {
            const browserLanguage = window.navigator.languages
                ? window.navigator.languages[0]
                : (window.navigator['userLanguage'] || window.navigator.language);

            let currentLanguage = APP_CONFIG.availableLanguages[0];

            for ( let language of APP_CONFIG.availableLanguages) {
                (browserLanguage.toLowerCase().indexOf(language) !== -1) && (currentLanguage = language);
            }

            this.useLanguage(currentLanguage);

        } else {
            this.translate.setDefaultLang('pl');
        }
    }

    /**
     * Sets specific language across whole application
     * @example
     * // Simply pass language short code
     * useLanguage(\'pl\');
     *
     * @param {string} language
     */
    useLanguage(language: string) {
        this.translate.setDefaultLang(language);
        this.translate.use(language);
        isPlatformBrowser(this.platformId) && this.renderer.setAttribute(document.documentElement, 'lang', language);
    }

    /**
     * Scroll to the top of the page and set focus on the top element
     */
    private scrollTop() {
        if (isPlatformBrowser(this.platformId) && !this.isBackState) {
            window.scrollTo(0, 0);
            document.getElementById('top').focus();
        } else {
            this.isBackState = false;
        }
    }
}
