import { inject, Injectable } from '@angular/core';

import { FavouriteToastService } from './favourite-toast.service';

export type FavouriteOperation = 'add' | 'remove';

/**
 * Maps HTTP errors of POST/DELETE /datasets/:id/likes to toast messages.
 * The message depends only on the status (not on the backend `detail`).
 */
@Injectable({ providedIn: 'root' })
export class FavouriteErrorHandler {
  private readonly toasts = inject(FavouriteToastService);

  handle(error: { status?: number } | null | undefined, operation: FavouriteOperation): void {
    const status = error?.status;
    if (status === 401) {
      // handled by the unregistered interceptor (redirect to login + message)
      return;
    }
    this.toasts.show('info', this.resolveKey(status, operation));
  }

  private resolveKey(status: number | undefined, operation: FavouriteOperation): string {
    switch (status) {
      case 409:
        return operation === 'add' ? 'Favorites.Toasts.AlreadyExists' : 'Favorites.Toasts.AlreadyRemoved';
      case 404:
        return operation === 'add' ? 'Favorites.Toasts.AccessError' : 'Favorites.Toasts.AlreadyRemoved';
      case 429:
        return 'Favorites.Toasts.TooManyRequests';
      default:
        return 'Favorites.Toasts.AddError';
    }
  }
}
