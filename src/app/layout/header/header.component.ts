import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { Component, Inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { UserStateService } from '@app/services/user-state.service';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { BehaviorSubject, Observable } from 'rxjs';
import { filter } from 'rxjs/operators';

import { toggleVertically } from '@app/animations';
import { HighContrastService } from '@app/services/high-contrast.service';
import { LanguageBootstrapService } from '@app/services/language-bootstrap.service';
import { LoginService } from '@app/services/login-service';
import { User } from '@app/services/models';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { UserService } from '@app/services/user.service';
import { APP_CONFIG } from '@app/app.config';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { CmsService } from '@app/services/cms.service';
import { IHome } from '@app/services/models/cms/pages/home';

/**
 * Header Component
 */
@Component({
  selector: 'app-header',
  templateUrl: './header.component.html',
  animations: [toggleVertically],
})
export class HeaderComponent implements OnInit {
  /**
   * Router endpoints
   */
  readonly routerEndpoints = RouterEndpoints;

  /**
   * Previous language
   */
  previousLang: string;

  /**
   * Current language
   */
  currentLang: string;

  /**
   * Menu Collapsed Flag
   */
  isMenuCollapsed: boolean = true;

  /**
   * Logged In flag
   */
  loggedIn: boolean = false;

  /**
   * User Observable
   */
  user$: Observable<User> = this.userStateService.getCurrentUser();

  /**
   * App config
   */
  appConfig = APP_CONFIG;

  /**
   * Single cms widget
   */
  singleCmsWidget: IWidget;

  /**
   * @ignore
   */
  constructor(
    public translate: TranslateService,
    public cmsService: CmsService,
    private userService: UserService,
    private userStateService: UserStateService,
    private cookieService: CookieService,
    private languageBootstrapService: LanguageBootstrapService,
    private router: Router,
    private localizeRouterService: LocalizeRouterService,
    private renderer: Renderer2,
    private highContrastService: HighContrastService,
    private loginService: LoginService,
    private featureFlagService: FeatureFlagService,
    @Inject(PLATFORM_ID) private platformId: string,
    @Inject(DOCUMENT) private document: string,
  ) {}

  /**
   * Initializes logged in user.
   * Auto closes menu in mobile mode.
   * On language change navigates to home page simulating page refresh
   */
  ngOnInit() {
    this.previousLang = this.translate.currentLang;
    this.currentLang = this.translate.currentLang;

    this.loginService.loggedIn.subscribe(isLoggedIn => {
      this.loggedIn = isLoggedIn;
    });
    this.highContrastService.init(this.renderer);

    // auto close menu in mobile mode
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe(() => !this.isMenuCollapsed && (this.isMenuCollapsed = !this.isMenuCollapsed));

    this.assignCmsSection();
  }

  /**
   * Assigns cms section
   */
  private assignCmsSection() {
    this.cmsService.getHomePageWidgets().subscribe((homeWidgets: IHome) => {
      if (homeWidgets.over_login_section_cb && homeWidgets.over_login_section_cb.length) {
        this.singleCmsWidget = homeWidgets.over_login_section_cb[0];
      }
    });
  }

  /**
   * Logouts and redirects user to the login page when current page requires auth
   */
  logout() {
    this.userService.logout().subscribe(() => {
      this.userStateService.clearCurrentUser();
      const urlsThatRequiresAuth = new RegExp(/\/(user\/)(dashboard)\//);
      if (this.router.url.match(urlsThatRequiresAuth)) {
        this.router.navigate(this.localizeRouterService.translateRoute(['/!user', '!login']) as []);
      }
    });
  }

  /**
   * Changes language for the entire app.
   * @param language
   */
  useLanguage(language: string) {
    this.currentLang = language;
    this.translate.use(language);
    this.cookieService.set('currentLang', language, undefined, '/');
    isPlatformBrowser(this.platformId) && (window.location.href = '/' + language);
    this.languageBootstrapService.setBootstrapLanguage(language);
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
    if (isPlatformBrowser(this.platformId)) {
      this.highContrastService.useHighContrast(value);
    }
  }

  /**
   * Disables high contrast.
   */
  disableHighContrast() {
    if (isPlatformBrowser(this.platformId)) {
      this.highContrastService.disableHighContrast();
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
