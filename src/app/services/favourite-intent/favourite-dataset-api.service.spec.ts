import { TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { DatasetService } from '@app/services/dataset.service';
import { FAVOURITE_API } from './favourite-action.service';
import { FavouriteDatasetApi } from './favourite-dataset-api.service';

describe('FavouriteDatasetApi', () => {
  const datasetService = { markDatasetAsLiked: jest.fn() };
  let api: FavouriteDatasetApi;

  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({ providers: [{ provide: DatasetService, useValue: datasetService }] });
    api = TestBed.inject(FavouriteDatasetApi);
  });

  it('is the default FAVOURITE_API implementation', () => {
    expect(TestBed.inject(FAVOURITE_API)).toBe(api);
  });

  it('adds via POST likes endpoint and returns likes count', () => {
    datasetService.markDatasetAsLiked.mockReturnValue(of(5));
    let count: number | null | undefined;
    api.add('1').subscribe((value) => (count = value));
    expect(datasetService.markDatasetAsLiked).toHaveBeenCalledWith('1');
    expect(count).toBe(5);
  });
});
