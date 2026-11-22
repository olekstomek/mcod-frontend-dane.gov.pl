import { NgIf } from '@angular/common';
import { Component, effect, inject, input, output } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';
import { ApiModel } from '@app/services/api/api-model';
import { FavouritePostLoginService } from '@app/services/favourite-intent/favourite-post-login.service';
import { ResultItemDetailsData } from '@app/services/models/result-item-details';
import { DefaultResultItemComponent } from '@app/shared/result-list/result-item/default-result-item/default-result-item.component';
import { ResultListComponent } from '@app/shared/result-list/result-list.component';
import { DetailsResultItemComponent } from '@app/shared/result-list/right-column/details-result-item/details-result-item.component';
import { SubscribeButtonComponent } from '@app/shared/subscribe-button/subscribe-button.component';
import { isUndefined } from '@app/shared/util';
interface DatasetResultItem {
  id: string;
  url: string;
  detailsData: ResultItemDetailsData[];
  titleTranslationKey: string;
  attributes: { model: ApiModel; is_liked_by_current_user?: boolean; likes_count?: number };
}
/**
 * Component to show dataset results
 */
@Component({
  selector: 'app-dataset-results',
  templateUrl: './dataset-results.component.html',
  standalone: true,
  imports: [
    ResultListComponent,
    DefaultResultItemComponent,
    DetailsResultItemComponent,
    NgIf,
    SubscribeButtonComponent,
    TranslatePipe,
  ],
})
export class DatasetResultsComponent {
  /**
   * API model
   */
  apiModel = ApiModel;
  /**
   * items to display
   */
  readonly items = input<DatasetResultItem[] | null>();
  /**
   * is user logged in
   */
  readonly isUserLoggedIn = input(false);
  readonly favoriteChanged = output<boolean>();
  protected useConfirmation = input(false);
  private readonly favouritePostLogin = inject(FavouritePostLoginService);
  constructor() {
    // restored list does not contain the dataset chosen before login -> drop the intent, no API call
    effect(
      () => {
        const readyDatasetId = this.favouritePostLogin.readyDatasetId();
        const items = this.items();
        if (readyDatasetId && Array.isArray(items) && !items.some((item) => this.isDataset(item, readyDatasetId))) {
          this.favouritePostLogin.discardMissing();
        }
      },
      { allowSignalWrites: true },
    );
  }
  private isDataset(item: DatasetResultItem, datasetId: string): boolean {
    return item.id === datasetId && item.attributes.model === ApiModel.DATASET;
  }

  protected onChildFavoriteChanged(isFavorite: boolean): void {
    this.favoriteChanged.emit(isFavorite);
  }

  protected isDatasetView(item: DatasetResultItem): boolean {
    return item.attributes.model === ApiModel.DATASET || isUndefined(item.attributes.model);
  }
}
