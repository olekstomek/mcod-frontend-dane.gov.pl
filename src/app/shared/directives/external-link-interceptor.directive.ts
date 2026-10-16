import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { ComponentType } from '@angular/cdk/portal';
import { Directive, HostListener, inject, input, InputSignal } from '@angular/core';

@Directive({
  selector: '[appExternalLinkInterceptor]',
  standalone: true,
})
export class ExternalLinkInterceptorDirective {
  modalComponent: InputSignal<ComponentType<unknown>> = input.required<ComponentType<unknown>>();
  dialogDataFactory: InputSignal<((href: string) => unknown) | undefined> = input<(href: string) => unknown>();

  private _dialog: MatDialog = inject(MatDialog);

  @HostListener('click', ['$event'])
  onClick(event: MouseEvent): void {
    const target: HTMLElement = event.target as HTMLElement;
    const anchor: HTMLAnchorElement | null = target.closest('a');

    if (!anchor) {
      return;
    }

    const href: string | null = anchor.getAttribute('href');
    if (!href) {
      return;
    }

    if (this._isExternalUrl(href)) {
      event.preventDefault();

      const factory: ((href: string) => unknown) | undefined = this.dialogDataFactory();
      const data: unknown = factory ? factory(href) : { url: href };

      const dialogRef: MatDialogRef<unknown, boolean> = this._dialog.open(this.modalComponent(), {
        data,
        panelClass: 'leave-domain-dialog-panel',
        backdropClass: 'leave-domain-dialog-backdrop',
        width: '720px',
        maxWidth: '100vw',
        maxHeight: '100vh',
        autoFocus: true,
      });

      dialogRef.afterClosed().subscribe((confirmed: boolean | undefined) => {
        if (confirmed) {
          window.open(href, '_blank', 'noopener,noreferrer');
        }
      });
    }
  }

  private _isExternalUrl(url: string): boolean {
    try {
      const currentHost: string = window.location.origin;
      const parsedUrl: URL = new URL(url, currentHost);
      return parsedUrl.origin !== currentHost;
    } catch {
      return false;
    }
  }
}
