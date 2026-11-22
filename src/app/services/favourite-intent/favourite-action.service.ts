import { inject, Injectable, InjectionToken } from '@angular/core';
import { Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { Observable } from 'rxjs';

import { FavouriteToastService } from './favourite-toast.service';
import { FavouriteErrorHandler } from './favourite-error-handler';
import { UserService } from '@app/services/user.service';
import { FavouriteDatasetApi } from './favourite-dataset-api.service';
import { FavouriteIntentStorageService } from './favourite-intent-storage.service';

export interface FavouriteApi {
  /** POST /datasets/:id/likes; emits likes count after the operation (null if not returned), 409 = already liked */
  add(datasetId: string): Observable<number | null>;
}

export const FAVOURITE_API = new InjectionToken<FavouriteApi>('FAVOURITE_API', {
  providedIn: 'root',
  factory: () => inject(FavouriteDatasetApi),
});

@Injectable({ providedIn: 'root' })
export class FavouriteActionService {
  private readonly router = inject(Router);
  private readonly localize = inject(LocalizeRouterService);
  private readonly storage = inject(FavouriteIntentStorageService);
  private readonly user = inject(UserService);
  private readonly toasts = inject(FavouriteToastService);
  private readonly errorHandler = inject(FavouriteErrorHandler);
  readonly api = inject(FAVOURITE_API, { optional: true });

  request(datasetId: string, listPosition: number): void {
    if (this.user.isLoggedIn()) {
      this.add(datasetId);
      return;
    }
    const isIntentSaved = this.storage.save({
      datasetId,
      listPosition,
      returnUrl: this.router.url,
      createdAt: Date.now(),
    });
    if (!isIntentSaved) {
      this.toasts.show('danger', 'Favorites.Toasts.AddError');
      return;
    }
    this.router.navigate(this.localize.translateRoute(['/!user', '!login']) as []);
  }

  /**
   * Adds dataset to favourites with a single POST. The response decides the outcome:
   * success -> added, 409 -> already in favourites (button state is still updated), other -> error.
   */
  add(datasetId: string, onAdded?: (likesCount: number | null) => void): void {
    const api = this.api;
    if (!api) {
      this.toasts.show('danger', 'Favorites.Toasts.AddError');
      return;
    }
    api.add(datasetId).subscribe({
      next: (likesCount) => onAdded?.(likesCount),
      error: (error) => {
        const status = error?.status;
        if (status === 409) {
          onAdded?.(null);
        }
        if (status === 409 || status === 404 || status === 429 || status === 401) {
          // 401 is skipped by the handler (interceptor redirects to login)
          this.errorHandler.handle(error, 'add');
          return;
        }
        this.toasts.show('danger', 'Favorites.Toasts.AddError');
      },
    });
  }
}
