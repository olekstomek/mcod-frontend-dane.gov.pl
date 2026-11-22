import { inject, Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { DatasetService } from '@app/services/dataset.service';
import type { FavouriteApi } from './favourite-action.service';
/**
 * Implementation of FavouriteApi based on DatasetService.
 * A single POST /datasets/:id/likes is authoritative: success = added, 409 = already liked.
 */
@Injectable({ providedIn: 'root' })
export class FavouriteDatasetApi implements FavouriteApi {
  private readonly datasetService = inject(DatasetService);
  add(datasetId: string): Observable<number | null> {
    return this.datasetService.markDatasetAsLiked(datasetId);
  }
}
