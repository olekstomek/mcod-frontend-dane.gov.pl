import { isPlatformServer } from '@angular/common';
import { Component, Inject, Optional, PLATFORM_ID } from '@angular/core';
import { Router } from '@angular/router';

import { ResponseService } from '@app/ssr/response.service';

/**
 * Page Not Found Component
 */
@Component({
  selector: 'app-page-not-found',
  templateUrl: './page-not-found.component.html',
})
export class PageNotFoundComponent {
  /**
   * @ignore
   */
  constructor(
    @Optional() private readonly responseService: ResponseService,
    @Inject(PLATFORM_ID) private readonly platformId: string,
    private router: Router,
  ) {
    if (isPlatformServer(this.platformId)) {
      this.responseService.setStatusCode(404);
    } else {
      if (router.url.startsWith('/pl') || router.url.startsWith('/en')) {
        return;
      }
      this.router.navigateByUrl('/pl' + this.router.url);
    }
  }
}
