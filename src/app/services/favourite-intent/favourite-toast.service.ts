import { inject, Injectable, signal } from '@angular/core';
import { NavigationStart, Router } from '@angular/router';

export type FavouriteToastType = 'success' | 'danger' | 'info';

export interface FavouriteToast {
  id: number;
  type: FavouriteToastType;
  /** translation key, resolved in the view so the text follows the current language */
  messageKey: string;
}

/**
 * Toasts dedicated to the favourites feature. Independent from NotificationsService / app-notifications.
 * A toast is closed only by the user, by navigating to another page or by a page refresh (state is in memory only).
 */
@Injectable({ providedIn: 'root' })
export class FavouriteToastService {
  private readonly router = inject(Router);
  private readonly toastsState = signal<FavouriteToast[]>([]);
  private nextId = 1;

  readonly toasts = this.toastsState.asReadonly();

  constructor() {
    this.router.events?.subscribe((event) => {
      if (event instanceof NavigationStart) {
        this.clear();
      }
    });
  }

  show(type: FavouriteToastType, messageKey: string): void {
    if (this.toastsState().some((toast) => toast.messageKey === messageKey && toast.type === type)) {
      return;
    }
    this.toastsState.update((toasts) => [...toasts, { id: this.nextId++, type, messageKey }]);
  }

  dismiss(id: number): void {
    this.toastsState.update((toasts) => toasts.filter((toast) => toast.id !== id));
  }

  clear(): void {
    if (this.toastsState().length) {
      this.toastsState.set([]);
    }
  }
}
