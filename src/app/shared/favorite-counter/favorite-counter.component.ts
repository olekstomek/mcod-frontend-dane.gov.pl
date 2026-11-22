import { Component, computed, inject, input, Signal } from '@angular/core';
import { TranslateService } from '@ngx-translate/core';

export function getPolishPluralSuffix(count: number): 'Zero' | 'One' | 'Few' | 'Many' {
  if (count === 0) {
    return 'Zero';
  }

  if (count === 1) {
    return 'One';
  }

  const mod10: number = count % 10;
  const mod100: number = count % 100;

  if (mod10 >= 2 && mod10 <= 4 && !(mod100 >= 12 && mod100 <= 14)) {
    return 'Few';
  }

  return 'Many';
}

@Component({
  selector: 'app-favorite-counter',
  standalone: true,
  templateUrl: './favorite-counter.component.html',
  styleUrl: './favorite-counter.component.scss',
})
export class FavoriteCounterComponent {
  favoritesCount = input<number>(0);

  private _translateService = inject(TranslateService);
  private _translationKeyBasePath = `Favorites.Counter`;

  counterText: Signal<string> = computed(() => {
    const likesCount: number = this.favoritesCount();
    const suffix: string = getPolishPluralSuffix(likesCount);
    const translationKey = `${this._translationKeyBasePath}.${suffix}`;

    if (likesCount === 0) {
      return this._translateService.instant(translationKey);
    }

    const translatedAction: string = this._translateService.instant(translationKey);
    return `${likesCount} ${translatedAction}`;
  });
}
