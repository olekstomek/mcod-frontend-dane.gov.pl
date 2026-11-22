import { Injectable } from '@angular/core';

export interface FavouriteIntent {
  datasetId: string;
  returnUrl: string;
  listPosition: number;
  createdAt: number;
}

@Injectable({ providedIn: 'root' })
export class FavouriteIntentStorageService {
  private readonly key = 'otd_favourite_intent';
  /**
   * In-memory marker (never persisted): an intent was saved in this page session and not yet consumed.
   * Lets us tell "entry vanished after the click" apart from a regular login without any intent.
   */
  private saved = false;

  save(intent: FavouriteIntent): boolean {
    try {
      sessionStorage.setItem(this.key, JSON.stringify(intent));
      this.saved = true;
      return true;
    } catch {
      return false;
    }
  }

  read(): string | null {
    try {
      return sessionStorage.getItem(this.key);
    } catch {
      return null;
    }
  }

  /** true when an intent was saved in this page session and has not been consumed or cleared yet */
  hasSavedIntent(): boolean {
    return this.saved;
  }
  clear(): void {
    this.saved = false;
    try {
      sessionStorage.removeItem(this.key);
    } catch {
      return;
    }
  }
}
