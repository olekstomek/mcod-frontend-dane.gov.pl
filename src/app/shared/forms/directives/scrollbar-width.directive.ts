import { AfterViewInit, DestroyRef, Directive, ElementRef, NgZone, inject } from '@angular/core';

@Directive({
  selector: '[appScrollbarWidth]',
  host: {
    '(input)': 'updateScrollbarWidth()',
  },
  standalone: true,
})
export class ScrollbarWidthDirective implements AfterViewInit {
  private readonly host = inject(ElementRef<HTMLElement>);
  private readonly zone = inject(NgZone);
  private readonly destroyRef = inject(DestroyRef);

  private resizeObserver?: ResizeObserver;

  ngAfterViewInit(): void {
    const textarea = this.getTextarea();
    if (!textarea) {
      return;
    }

    this.updateScrollbarWidth();

    this.zone.runOutsideAngular(() => {
      this.resizeObserver = new ResizeObserver(() => {
        this.updateScrollbarWidth();
      });

      this.resizeObserver.observe(textarea);
    });

    this.destroyRef.onDestroy(() => {
      this.resizeObserver?.disconnect();
    });
  }

  readonly updateScrollbarWidth = (): void => {
    const textarea = this.getTextarea();
    if (!textarea) {
      return;
    }

    const styles = getComputedStyle(textarea);
    const borderLeft = parseFloat(styles.borderLeftWidth || '0');
    const borderRight = parseFloat(styles.borderRightWidth || '0');
    const scrollbarWidth = Math.max(0, textarea.offsetWidth - textarea.clientWidth - borderLeft - borderRight);

    this.host.nativeElement.style.setProperty('--scrollbar-width', `${scrollbarWidth}px`);
  };

  private getTextarea(): HTMLTextAreaElement | null {
    return this.host.nativeElement.querySelector('textarea');
  }
}
