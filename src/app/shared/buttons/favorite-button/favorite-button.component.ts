import { Component, computed, inject, input, output } from '@angular/core';
import { ConfirmDialogService } from '@app/shared/confirm-dialog/confirm-dialog.service';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { take } from 'rxjs';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './favorite-button.component.html',
  styleUrl: './favorite-button.component.scss',
})
export class FavoriteButtonComponent {
  useConfirmation = input(false);
  favorite = input(false);
  requestOnly = input(false);
  /** true while the like/unlike request is pending - button is greyed out */
  readonly pending = input(false);
  favoriteRequested = output<void>();

  private readonly _dialog = inject(ConfirmDialogService);
  private readonly _translateService = inject(TranslateService);

  toggleFavorite(event: Event) {
    if (this.pending()) {
      return;
    }

    if (this.favorite() && this.useConfirmation()) {
      const options = {
        title: this._translateService.instant('Favorites.Popup.Title'),
        message: this._translateService.instant('Favorites.Popup.Message'),
        confirmText: this._translateService.instant('Favorites.Popup.Confirm'),
        cancelText: this._translateService.instant('Favorites.Popup.Cancel'),
      };

      this._dialog.open(options);
      this._dialog
        .confirmed()
        .pipe(take(1))
        .subscribe((confirmed) => {
          if (confirmed) {
            this._emitToggleFavorite(event);
          }
        });
      return;
    }

    this._emitToggleFavorite(event);
  }

  protected buttonLabelTranslationKey = computed(() =>
    this.favorite() ? 'Favorites.Toggle.Remove' : 'Favorites.Toggle.Add',
  );

  protected svgFill = computed(() => (this.favorite() ? 'currentColor' : 'none'));

  private _emitToggleFavorite(event: Event): void {
    event.stopPropagation();
    this.favoriteRequested.emit();
  }
}
