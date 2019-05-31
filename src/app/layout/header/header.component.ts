import { Component, OnInit, Renderer2, PLATFORM_ID, Inject } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { isPlatformBrowser, DOCUMENT } from '@angular/common';
import { TranslateService } from '@ngx-translate/core';
import { filter } from 'rxjs/operators';

import { UserService } from '@app/services/user.service';
import { toggleVertically } from '@app/animations';
import { User } from '@app/services/models';
import { Observable } from 'rxjs';

/**
 * Header Component
 */
@Component({
    selector: 'app-header',
    templateUrl: './header.component.html',
    animations: [
        toggleVertically
    ]
})
export class HeaderComponent implements OnInit {

    currentLang: string;
    isMenuCollapsed: boolean = true;
    loggedIn: boolean = false;
    loggedUser: User;
    user$: Observable<User> = this.userService.getCurrentUser();


    /**
     * @ignore
     */
    constructor(private translate: TranslateService,
                private userService: UserService,
                private router: Router,
                private renderer: Renderer2,
                @Inject(PLATFORM_ID) private platformId: string,
                @Inject(DOCUMENT) private document: string) {
    }

    /**
     * Initializes loggen in user.
     * Auto closes menu in mobile mode.
     */   
    ngOnInit() {
        this.currentLang = this.translate.currentLang;

        this.userService.loggedIn.subscribe(isLoggedIn => {
            this.loggedIn = isLoggedIn;
        });

        // auto close menu in mobile mode
        this.router.events
            .pipe(
                filter(event => event instanceof NavigationEnd)
            )
            .subscribe((event: NavigationEnd) => {
                    !this.isMenuCollapsed && (this.isMenuCollapsed = !this.isMenuCollapsed);
                }
            );
    }

    /**
     * Logouts and redirects user to the login page
     */
    logout() {
        this.userService.logout().subscribe(() => {
            this.router.navigate(['/user', 'login']);
        });
    }

    /**
     * Changes language for the entire app.
     * @param language
     */
    useLanguage(language: string) {
        this.currentLang = language;
        this.translate.use(language);
        isPlatformBrowser(this.platformId) && this.renderer.setAttribute(document.documentElement, 'lang', language);
    }

    /**
     * Increases or descreases font size. Improves accessibility for low-vision aids.
     * @param value
     */
    useFontSize(value) {
        // setStyle doesn't work on IE
        isPlatformBrowser(this.platformId) && this.renderer.setAttribute(document.documentElement, 'style', `font-size: ${value}%`);
    }

    /**
     * Turns on high contrast. Improves accessibility for low-vision aids.
     * @param value
     */
    useHighContrast(value) {
        this.disableHighContrast();
        isPlatformBrowser(this.platformId) && this.renderer.addClass(this.document['body'], value);
    }

    /**
     * Disables high contrast.
     */
    disableHighContrast() {
        if (isPlatformBrowser(this.platformId)) {
            this.renderer.removeClass(this.document['body'], 'black-white');
            this.renderer.removeClass(this.document['body'], 'black-yellow');
            this.renderer.removeClass(this.document['body'], 'yellow-black');
        }
    }

    /**
     * Skip links navigation handler.
     * Improves accessibility without mouse.
     * @param elementId
     * @param event
     */
    skipTo(elementId: string, event: Event) {
        event.preventDefault();
        isPlatformBrowser(this.platformId) && document.getElementById(elementId).focus();
    }
}
