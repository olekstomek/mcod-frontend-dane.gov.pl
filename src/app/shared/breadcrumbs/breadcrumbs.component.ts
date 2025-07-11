import { Component, OnDestroy } from '@angular/core';
import { Router } from '@angular/router';
import { Subscription } from 'rxjs';

import { RoutingHelper } from '@app/services/commons/routing-helper';
import { Breadcrumb } from '@app/shared/breadcrumbs/Breadcrumb';
import { BreadcrumbService } from '@app/shared/breadcrumbs/breadcrumb.service';

/**
 * Breadcrumbs global component
 */
@Component({
  selector: 'app-breadcrumbs',
  templateUrl: './breadcrumbs.component.html',
})
export class BreadcrumbsComponent implements OnDestroy {
  /**
   * Breadcrumbs value
   */
  public breadcrumbs: Array<Breadcrumb>;

  /**
   * Determines breadcrumbs visibility based on specific page. By default breadcrumbs are hidden on home page.
   */
  public displayBreadcrumbs: boolean;

  /**
   * Breadcrumb subscription
   * @type {Subscription}
   */
  private breadcrumbs$: Subscription;

  /**
   * Subscribes to router changes and updates breadcrumbs every time url changes
   * @param {BreadcrumbService} breadcrumbService
   * @param router
   */
  constructor(private readonly breadcrumbService: BreadcrumbService, private readonly router: Router) {
    this.breadcrumbs$ = this.breadcrumbService.getBreadcrumbs().subscribe(res => {
      this.breadcrumbs = res;

      this.displayBreadcrumbs = !this.router.isActive('/pl', true) && !RoutingHelper.isHomePage(this.router.url);
    });
  }

  /**
   * Unsubscribes from breadcrumb observable
   */
  ngOnDestroy() {
    this.breadcrumbs$.unsubscribe();
  }
}
