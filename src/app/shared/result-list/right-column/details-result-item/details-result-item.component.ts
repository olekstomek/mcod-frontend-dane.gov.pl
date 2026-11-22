import { AsyncPipe, NgClass, NgFor, NgIf } from '@angular/common';
import {
  ChangeDetectorRef,
  Component,
  computed,
  effect,
  ElementRef,
  inject,
  input,
  Input,
  OnDestroy,
  OnInit,
  output,
  signal,
} from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { finalize, takeUntil } from 'rxjs/operators';
import { TranslateDateFormatPipe } from '../../../pipes/translate-date-format.pipe';

import { HighContrastModeEnum, HighContrastService } from '@app/services/high-contrast.service';
import { ResultItemDetailsData } from '@app/services/models/result-item-details';
import { FavoriteButtonComponent } from '@app/shared/buttons/favorite-button/favorite-button.component';
import { FavoriteCounterComponent } from '@app/shared/favorite-counter/favorite-counter.component';
import { DatasetService } from '@app/services/dataset.service';
import { FavouriteActionService } from '@app/services/favourite-intent/favourite-action.service';
import { UserService } from '@app/services/user.service';
import { FavouriteErrorHandler } from '@app/services/favourite-intent/favourite-error-handler';
import { FavouritePostLoginService } from '@app/services/favourite-intent/favourite-post-login.service';
import { InfoTooltipDirective } from '@app/shared/info-tooltip/info-tooltip.directive';

/**
 * TODO Create abstract component or interface for result item
 * Component which displays additional data on the right column of list view
 */
@Component({
  selector: 'app-details-result-item',
  templateUrl: './details-result-item.component.html',
  standalone: true,
  imports: [
    NgIf,
    NgClass,
    NgFor,
    AsyncPipe,
    TranslatePipe,
    TranslateDateFormatPipe,
    FavoriteButtonComponent,
    FavoriteCounterComponent,
    InfoTooltipDirective,
  ],
})
export class DetailsResultItemComponent implements OnInit, OnDestroy {
  protected useConfirmation = input(false);
  private readonly cdr = inject(ChangeDetectorRef);
  private readonly highContrastService = inject(HighContrastService);
  private readonly datasetService = inject(DatasetService);
  private readonly favouriteActions = inject(FavouriteActionService);
  private readonly favouriteErrorHandler = inject(FavouriteErrorHandler);
  private readonly userService = inject(UserService);
  private readonly favouritePostLogin = inject(FavouritePostLoginService);
  private readonly host = inject<ElementRef<HTMLElement>>(ElementRef);
  /** completes the favourite operation started before login, once the user is back on the list */
  private readonly resumeFavouriteEffect = effect(
    () => {
      this.favouritePostLogin.readyDatasetId();
      this.resumeFavouriteAfterLogin();
    },
    { allowSignalWrites: true },
  );
  /**
   * icon name based on category
   */
  categoryIcon: string;

  iconName: string;

  /**
   * array with data which will be displayed
   */
  @Input() detailsData: ResultItemDetailsData[];

  /**
   * showcase category name to display
   */
  @Input() showcaseCategoryName: string;

  /**
   * showcase category key
   */
  @Input() showcaseCategoryKey: string;

  /**
   * key to translation
   */
  @Input() titleTranslationKey: string;

  /**
   * enable/disable displaying each detail {key: value} in one row
   */
  @Input() showEachDetailInRow = false;

  /**
   * check if is showcases view
   */
  @Input() isShowcaseView = false;

  /**
   * check if is search and showcase view
   */
  @Input() isSearchShowcaseView = false;

  /**
   * check if is dataset view
   */
  @Input() isDatasetView = false;

  @Input() datasetId: string | null = null;
  /** 1-based position of the item on the current list page (saved for returning after login) */
  @Input() listPosition = 1;
  @Input() favorite = false;
  /** initial likes counter from API (likes_count) */
  @Input() likesCount = 0;
  readonly favoriteChanged = output<boolean>();

  highContrastMode: HighContrastModeEnum;
  destroy$: Subject<void> = new Subject<void>();

  // local state set after successful request; null = use value from input
  private readonly favoriteState = signal<boolean | null>(null);
  private readonly likesCountState = signal<number | null>(null);
  protected readonly isRequestPending = signal(false);
  protected isFavorite = computed(() => this.favoriteState() ?? this.favorite);
  protected favoritesCount = computed(() => this.likesCountState() ?? this.likesCount);

  ngOnInit() {
    this.highContrastService
      .getCurrentContrastMode()
      .pipe(takeUntil(this.destroy$))
      .subscribe((mode) => {
        this.highContrastMode = mode;
        // parent (e.g. favorite-details) is OnPush - force re-render of the icon class
        this.cdr.markForCheck();
      });
    switch (this.showcaseCategoryKey) {
      case 'app':
        this.categoryIcon = 'ic-aplikacje';
        break;
      case 'www':
        this.categoryIcon = 'ic-portal-www';
        break;
      case 'other':
        this.categoryIcon = 'ic-inne';
        break;
    }

    switch (this.titleTranslationKey) {
      case 'Datasets.Single':
        this.iconName = 'dataset';
        break;
      case 'Resources.Single':
        this.iconName = 'resource';
        break;
    }
    this.resumeFavouriteAfterLogin();
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  private resumeFavouriteAfterLogin(): void {
    const datasetId = this.datasetId;
    if (!datasetId || this.favouritePostLogin.readyDatasetId() !== datasetId) {
      return;
    }
    this.favouritePostLogin.finish(
      datasetId,
      () => this.host.nativeElement.scrollIntoView?.({ block: 'center' }),
      (likesCount) => {
        this.favoriteState.set(true);
        this.favoriteChanged.emit(true);
        if (likesCount !== null) {
          this.likesCountState.set(likesCount);
          return;
        }
        // counter is not returned for 409 - fetch the current one instead of guessing
        this.datasetService.getDatasetLikesCount(datasetId).subscribe((count) => {
          if (count !== null) {
            this.likesCountState.set(count);
          }
        });
      },
    );
  }
  /**
   * Adds / removes dataset from favourites (POST / DELETE /datasets/:id/likes)
   * and sets state according to the server response.
   */
  protected toggleFavourite(): void {
    if (!this.datasetId || this.isRequestPending()) {
      return;
    }
    if (!this.userService.isLoggedIn()) {
      // not logged in: remember the intent (list state + dataset) and redirect to login
      this.favouriteActions.request(this.datasetId, this.listPosition);
      return;
    }
    const wasFavorite = this.isFavorite();
    const request$ = wasFavorite
      ? this.datasetService.markDatasetAsUnliked(this.datasetId)
      : this.datasetService.markDatasetAsLiked(this.datasetId);

    this.isRequestPending.set(true);
    request$.pipe(finalize(() => this.isRequestPending.set(false))).subscribe({
      next: (likesCount) => {
        const newFavoriteState = !wasFavorite;
        this.favoriteState.set(newFavoriteState);
        this.favoriteChanged.emit(newFavoriteState);
        // server counter is authoritative, local +/-1 only when it was not returned
        this.likesCountState.set(likesCount ?? Math.max(0, this.favoritesCount() + (wasFavorite ? -1 : 1)));
      },
      error: (error) => {
        this.favouriteErrorHandler.handle(error, wasFavorite ? 'remove' : 'add');
        // 409 - server state differs from local one, so align local flag and refetch the counter
        if (error?.status === 409) {
          const newFavoriteState = !wasFavorite;
          this.favoriteState.set(newFavoriteState);
          this.favoriteChanged.emit(newFavoriteState);
          this.datasetService.getDatasetLikesCount(this.datasetId).subscribe({
            next: (count) => {
              if (count !== null) {
                this.likesCountState.set(count);
              }
            },
            error: () => undefined,
          });
        }
      },
    });
  }
}
