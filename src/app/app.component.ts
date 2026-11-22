import { DOCUMENT, isPlatformBrowser, PlatformLocation } from '@angular/common';
import { Component, inject, OnInit, PLATFORM_ID, Renderer2 } from '@angular/core';
import { NavigationEnd, NavigationStart, Router, RouterOutlet } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'ngx-localstorage';
import { RouterEndpoints } from './services/models/routerEndpoints';

import { RoutingHelper } from '@app/services/commons/routing-helper';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { LanguageBootstrapService } from '@app/services/language-bootstrap.service';
import { SchemaService } from '@app/services/schema.service';
import { FavouriteToastComponent } from '@app/shared/favourite-toast/favourite-toast.component';
import { FavouritePostLoginService } from '@app/services/favourite-intent/favourite-post-login.service';

/**
 * Application Root Component
 */
@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  imports: [RouterOutlet, FavouriteToastComponent],
  standalone: true,
})
export class AppComponent implements OnInit {
  private readonly renderer = inject(Renderer2);
  private readonly location = inject(PlatformLocation);
  private readonly router = inject(Router);
  private readonly localStorage = inject(LocalStorageService);
  private readonly cookieService = inject(CookieService);
  private readonly languageBootstrapService = inject(LanguageBootstrapService);
  private readonly translateService = inject(TranslateService);
  private readonly featureFlagsService = inject(FeatureFlagService);
  private readonly schemaService = inject(SchemaService);
  private readonly favouritePostLogin = inject(FavouritePostLoginService);
  private readonly document = inject(DOCUMENT);
  private readonly platformId = inject(PLATFORM_ID);

  /**
   * Homepage flag
   */
  isHomepage: boolean;

  /**
   * User Dashboard flag
   */
  isUserDashboard: boolean;

  /**
   * Resource Page flag
   */
  isResourcePage: boolean;

  /**
   * Back state flag
   */
  private isBackState = false;

  /**
   * Default lang
   */
  private defaultLang = 'pl';

  /**
   * Current Lang Cookie Key
   */
  private currentLangCookieKey = 'currentLang';

  /**
   * Navigation checks and default language setting
   */
  ngOnInit() {
    this.document.documentElement.lang = this.translateService.currentLang;

    this.router.events.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.isResourcePage = event.url.indexOf(RouterEndpoints.RESOURCES) !== -1;
        this.schemaService.removeStructuredData();
      }

      if (event instanceof NavigationEnd) {
        this.isHomepage = RoutingHelper.isHomePage(event.url);
        if (!this.isResourcePage) {
          this.scrollTop();
        }
      }
    });

    this.favouritePostLogin.start();

    this.location.onPopState(() => {
      this.isBackState = true;
    });
  }

  /**
   * Scroll to the top of the page and set focus on the top element
   */
  private scrollTop() {
    if (isPlatformBrowser(this.platformId) && !this.isBackState) {
      window.scrollTo(0, 0);
      document.getElementById('top')?.focus();
    } else {
      this.isBackState = false;
    }
  }
}
