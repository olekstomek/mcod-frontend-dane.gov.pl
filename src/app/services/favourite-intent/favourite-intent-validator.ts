import { inject, Injectable } from '@angular/core';
import { Router } from '@angular/router';

import { APP_CONFIG } from '@app/app.config';
import { FavouriteIntent } from './favourite-intent-storage.service';

export enum FavouriteIntentStatus {
  VALID = 'VALID',
  NO_INTENT = 'NO_INTENT',
  INCOMPLETE = 'INCOMPLETE',
  INVALID_FORMAT = 'INVALID_FORMAT',
  UNSAFE_RETURN_PATH = 'UNSAFE_RETURN_PATH',
  EXPIRED = 'EXPIRED',
}

export type FavouriteIntentResult =
  | { status: FavouriteIntentStatus.VALID; intent: FavouriteIntent }
  | { status: Exclude<FavouriteIntentStatus, FavouriteIntentStatus.VALID> };

@Injectable({ providedIn: 'root' })
export class FavouriteIntentValidator {
  private readonly router = inject(Router);

  validate(raw: string | null, now = Date.now()): FavouriteIntentResult {
    if (raw === null) {
      return { status: FavouriteIntentStatus.NO_INTENT };
    }
    let intent: Partial<FavouriteIntent>;
    try {
      intent = JSON.parse(raw);
    } catch {
      return { status: FavouriteIntentStatus.INVALID_FORMAT };
    }
    if (!intent || typeof intent !== 'object') {
      return { status: FavouriteIntentStatus.INVALID_FORMAT };
    }
    if (!['datasetId', 'returnUrl', 'listPosition', 'createdAt'].every((key) => key in intent)) {
      return { status: FavouriteIntentStatus.INCOMPLETE };
    }
    if (
      typeof intent.datasetId !== 'string' ||
      !/^\d+$/.test(intent.datasetId) ||
      !Number.isSafeInteger(intent.listPosition) ||
      intent.listPosition < 1 ||
      !Number.isSafeInteger(intent.createdAt) ||
      intent.createdAt < 1 ||
      intent.createdAt > now ||
      typeof intent.returnUrl !== 'string'
    ) {
      return { status: FavouriteIntentStatus.INVALID_FORMAT };
    }
    if (intent.returnUrl.includes('\\') || !intent.returnUrl.startsWith('/') || intent.returnUrl.startsWith('//')) {
      return { status: FavouriteIntentStatus.UNSAFE_RETURN_PATH };
    }
    try {
      const tree = this.router.parseUrl(intent.returnUrl);
      const primarySegments = tree.root.children.primary?.segments;
      const segments = primarySegments?.map((segment) => segment.path);
      if (
        !segments ||
        !APP_CONFIG.availableLanguages.includes(segments[0]) ||
        segments[1] !== 'dataset' ||
        !this.isAllowedTail(segments.slice(2), intent.datasetId) ||
        primarySegments.some((segment) => Object.keys(segment.parameters).length) ||
        Object.keys(tree.root.children).some((outlet) => outlet !== 'primary') ||
        Object.keys(tree.root.children.primary.children).length ||
        Object.values(tree.queryParams).some((value) =>
          Array.isArray(value) ? value.some((part) => typeof part !== 'string') : typeof value !== 'string',
        )
      ) {
        return { status: FavouriteIntentStatus.UNSAFE_RETURN_PATH };
      }
    } catch {
      return { status: FavouriteIntentStatus.UNSAFE_RETURN_PATH };
    }
    if (now - intent.createdAt >= APP_CONFIG.favourites.intentTtlMs) {
      return { status: FavouriteIntentStatus.EXPIRED };
    }
    return { status: FavouriteIntentStatus.VALID, intent: intent as FavouriteIntent };
  }

  /**
   * Allowed return views: dataset list (`/lang/dataset`) or the details of the very same dataset
   * (`/lang/dataset/:id,:slug`). Subpages (resources, feedback, etc.) are not allowed.
   */
  private isAllowedTail(tail: string[], datasetId: string): boolean {
    if (tail.length === 0) {
      return true;
    }
    const match = tail.length === 1 ? /^(\d+)(?:,[A-Za-z0-9_-]+)?$/.exec(tail[0]) : null;
    return match !== null && match[1] === datasetId;
  }
}
