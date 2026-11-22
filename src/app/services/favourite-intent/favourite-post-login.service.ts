import { inject, Injectable, signal } from '@angular/core';
import { NavigationEnd, Router } from '@angular/router';

import { FavouriteActionService } from './favourite-action.service';
import { FavouriteIntent, FavouriteIntentStorageService } from './favourite-intent-storage.service';
import { FavouriteIntentStatus, FavouriteIntentValidator } from './favourite-intent-validator';
import { LoginService } from '@app/services/login-service';
import { FavouriteToastService } from './favourite-toast.service';
import { UserService } from '@app/services/user.service';

@Injectable({ providedIn: 'root' })
export class FavouritePostLoginService {
  private readonly router = inject(Router);
  private readonly login = inject(LoginService);
  private readonly user = inject(UserService);
  private readonly storage = inject(FavouriteIntentStorageService);
  private readonly validator = inject(FavouriteIntentValidator);
  private readonly toasts = inject(FavouriteToastService);
  private readonly actions = inject(FavouriteActionService);

  private emailLogin = false;
  private inFlight = false;
  private returned = false;
  private pending: FavouriteIntent | null = null;
  readonly readyDatasetId = signal<string | null>(null);

  start(): void {
    this.login.loggedIn.subscribe((loggedIn) => {
      if (loggedIn) {
        this.emailLogin = true;
      }
    });
    this.router.events.subscribe((event) => {
      if (!(event instanceof NavigationEnd)) {
        return;
      }
      if (this.pending && event.urlAfterRedirects === this.pending.returnUrl) {
        this.returned = true;
        this.readyDatasetId.set(this.pending.datasetId);
      }
      const tree = this.router.parseUrl(event.urlAfterRedirects);
      const segments = tree.root.children.primary?.segments.map((segment) => segment.path) || [];
      if (segments.includes('logingovpl-error') && tree.queryParams.logingovpl === 'login-error') {
        // WK login failed or was cancelled: drop the intent, no UI action, no API call
        this.reset();
        return;
      }
      if (
        !segments.includes('desktop') ||
        !segments.includes('dashboard') ||
        !this.user.isLoggedIn() ||
        (!this.emailLogin && tree.queryParams.logingovpl !== 'login-success') ||
        this.inFlight
      ) {
        return;
      }

      this.emailLogin = false;
      const result = this.validator.validate(this.storage.read());
      if (result.status === FavouriteIntentStatus.NO_INTENT) {
        // the entry vanished after the user clicked "add to favourites" (e.g. storage cleared): tell the user
        if (this.storage.hasSavedIntent()) {
          this.storage.clear();
          this.toasts.show('danger', 'Favorites.Toasts.AddError');
        }
        return;
      }
      if (result.status !== FavouriteIntentStatus.VALID) {
        this.storage.clear();
        this.toasts.show('danger', 'Favorites.Toasts.AddError');
        return;
      }
      this.inFlight = true;
      this.pending = result.intent;
      this.router.navigateByUrl(result.intent.returnUrl).then((success) => {
        if (!success) {
          this.inFlight = false;
          this.pending = null;
          this.readyDatasetId.set(null);
          this.toasts.show('danger', 'Favorites.Toasts.AddError');
        }
      });
    });
  }

  finish(datasetId: string, scroll: () => void, onAdded: (likesCount: number | null) => void): void {
    if (!this.returned || !this.pending || this.pending.datasetId !== datasetId) {
      return;
    }
    scroll();
    this.storage.clear();
    this.pending = null;
    this.returned = false;
    this.readyDatasetId.set(null);
    this.inFlight = false;
    this.actions.add(datasetId, onAdded);
  }

  private reset(): void {
    this.storage.clear();
    this.pending = null;
    this.returned = false;
    this.inFlight = false;
    this.emailLogin = false;
    this.readyDatasetId.set(null);
  }
  discardMissing(): void {
    if (!this.returned || !this.pending) {
      return;
    }
    this.storage.clear();
    this.pending = null;
    this.returned = false;
    this.readyDatasetId.set(null);
    this.inFlight = false;
    this.toasts.show('danger', 'Favorites.Toasts.AddError');
  }
}
