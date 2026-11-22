import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Directive, ElementRef, Input, OnDestroy, PLATFORM_ID, Renderer2, inject } from '@angular/core';
import { fromEvent, merge, Observable, Subscription } from 'rxjs';
import { map, throttleTime, distinctUntilChanged } from 'rxjs/operators';

@Directive({
  selector: '[appFixedSidebar]',
  standalone: true,
})
export class FixedSidebarDirective implements AfterViewInit, OnDestroy {
  /**
   * Min window width to position sidebar
   */
  @Input() fixedSidebarMinWindowWidth = 1200;
  /**
   * Time to get better performance, throttle the event stream and keep fixed element scrolling smooth
   */
  @Input() fixedSidebarThrottleTime = 20;
  /**
   * Padding from the top of the window during scroll
   */
  @Input() fixedSidebarPaddingTop = 15;

  /**
   * Window events subscription
   */
  private _windowEventsSubscription?: Subscription;
  private _lastPageY = 0;
  private _isFixed = false;

  private readonly _elementRef = inject(ElementRef);
  private readonly _renderer = inject(Renderer2);
  private readonly _document = inject(DOCUMENT);
  private readonly _platformId = inject(PLATFORM_ID);

  ngAfterViewInit() {
    if (!isPlatformBrowser(this._platformId)) {
      return;
    }
    this._positionSidebar();
  }

  private _positionSidebar() {
    const sidebar: HTMLElement = this._elementRef.nativeElement as HTMLElement;
    const parent: HTMLElement | null = sidebar.parentElement;
    if (!parent) return;

    const defaultView = this._document.defaultView;
    if (!defaultView) return;

    this._lastPageY = defaultView.pageYOffset;

    const resize$: Observable<Event> = fromEvent(defaultView, 'resize');
    const scroll$: Observable<Event> = fromEvent(defaultView, 'scroll');

    this._windowEventsSubscription = merge(resize$, scroll$)
      .pipe(
        throttleTime(this.fixedSidebarThrottleTime),
        map(() => defaultView.pageYOffset),
        distinctUntilChanged(),
      )
      .subscribe((pageY) => {
        const windowWidth: number = defaultView.innerWidth;

        if (windowWidth < this.fixedSidebarMinWindowWidth || parent.offsetHeight === sidebar.offsetHeight) {
          this._resetSidebar(sidebar);
          return;
        }

        const deltaY: number = pageY - this._lastPageY;
        this._lastPageY = pageY;

        if (pageY + this.fixedSidebarPaddingTop >= parent.offsetTop) {
          if (!this._isFixed) {
            this._isFixed = true;
            this._renderer.setStyle(sidebar, 'transition', 'none');
            this._renderer.setStyle(sidebar, 'position', 'fixed');
            this._renderer.setStyle(sidebar, 'top', `${this.fixedSidebarPaddingTop}px`);
            this._renderer.setStyle(sidebar, 'max-height', `calc(100vh - ${this.fixedSidebarPaddingTop + 20}px)`);
            this._renderer.setStyle(sidebar, 'overflow-y', 'auto');
          }

          if (deltaY !== 0) {
            const maxScroll: number = sidebar.scrollHeight - sidebar.clientHeight;
            if (maxScroll > 0) {
              sidebar.scrollTop = Math.max(0, Math.min(maxScroll, sidebar.scrollTop + deltaY));
            }
          }

          const absoluteLimit = parent.offsetHeight + parent.offsetTop - sidebar.offsetHeight;
          if (pageY > absoluteLimit) {
            this._renderer.setStyle(sidebar, 'position', 'absolute');
            this._renderer.setStyle(
              sidebar,
              'top',
              `${parent.offsetHeight + parent.offsetTop - sidebar.offsetHeight + this.fixedSidebarPaddingTop}px`,
            );
          } else {
            this._renderer.setStyle(sidebar, 'position', 'fixed');
            this._renderer.setStyle(sidebar, 'top', `${this.fixedSidebarPaddingTop}px`);
          }
        } else {
          this._resetSidebar(sidebar);
        }
      });
  }

  private _resetSidebar(sidebar: HTMLElement) {
    this._isFixed = false;
    this._renderer.removeAttribute(sidebar, 'style');
    sidebar.scrollTop = 0;
  }

  ngOnDestroy() {
    this._windowEventsSubscription?.unsubscribe();
  }
}
