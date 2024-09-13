import { isPlatformServer } from '@angular/common';
import { ChangeDetectorRef, Component, Inject, OnDestroy, OnInit, Optional, PLATFORM_ID, ViewChild } from '@angular/core';

import { Tour } from '@app/shared/tour/Tour';
import { TourDataService } from '@app/shared/tour/tour-data.service';
import { TourService } from '@app/shared/tour/tour.service';
import { TooltipDirective } from 'ngx-bootstrap';
import { LocalStorageService } from 'ngx-localstorage';
import { Subject } from 'rxjs';
import { take, takeUntil } from 'rxjs/operators';

/**
 * Tour button component
 */
@Component({
  selector: 'app-tour-button',
  templateUrl: './tour-button.component.html',
})
export class TourButtonComponent implements OnInit, OnDestroy {
  /**
   * Tooltip reference
   * @type {TooltipDirective}
   */
  @ViewChild('tooltip')
  tooltipRef: TooltipDirective;

  /**
   * Button visibility flag
   * @type {boolean}
   */
  isButtonVisible: boolean;

  /**
   * Current tour
   * @type {Tour}
   */
  currentTour: Tour;

  /**
   * Determine if button is active
   * @type {boolean}
   */
  isButtonActive: boolean = true;

  /**
   * Determine if tooltip is visible
   * @type {boolean}
   */
  isTooltipVisible: boolean = true;
  /**
   * Subscription cleanup subject
   * @type {Subject<void>}
   */
  private destroy$: Subject<void> = new Subject<void>();

  /**
   * @ignore
   */
  constructor(
    @Optional() private readonly tourDataService: TourDataService,
    @Optional() private readonly tourService: TourService,
    private readonly localStorageService: LocalStorageService,
    @Inject(PLATFORM_ID) private readonly platformId: string,
    private readonly changeDetectorRef: ChangeDetectorRef,
  ) {}

  /**
   * Cleanups subscriptions
   */
  ngOnDestroy(): void {
    this.destroy$.next();
  }

  /**
   * Shows tour
   */
  showTour(): void {
    this.tourService
      .getCurrentTour()
      .pipe(take(1))
      .subscribe(tour => {
        this.tourService.startTour(tour);
        this.tooltipRef && this.tooltipRef.isOpen && this.tooltipRef.hide();
      });
  }

  /**
   * Sets button visibility for current route
   */
  ngOnInit(): void {
    if (isPlatformServer(this.platformId)) {
      return;
    }
    this.tourService
      .getButtonVisibilityForCurrentRoute()
      .pipe(takeUntil(this.destroy$))
      .subscribe(isButtonVisible => {
        this.isButtonVisible = isButtonVisible;
        this.changeDetectorRef.detectChanges();
      });

    this.tourService.isButtonActive.pipe(takeUntil(this.destroy$)).subscribe(isButtonActive => {
      this.isButtonActive = isButtonActive;
      this.isTooltipVisible = !!!this.localStorageService.get('tourComplete');
      this.changeDetectorRef.detectChanges();
    });
  }
}
