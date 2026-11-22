import { TestBed } from '@angular/core/testing';
import { FavouriteIntentStorageService } from './favourite-intent-storage.service';

describe('FavouriteIntentStorageService', () => {
  let storage: FavouriteIntentStorageService;
  const intent = { datasetId: '4', returnUrl: '/pl/dataset', listPosition: 1, createdAt: 123 };

  beforeEach(() => {
    TestBed.configureTestingModule({});
    storage = TestBed.inject(FavouriteIntentStorageService);
    sessionStorage.clear();
  });

  afterEach(() => jest.restoreAllMocks());

  it('replaces the previous click and clears it', () => {
    expect(storage.save(intent)).toBe(true);
    expect(storage.save({ ...intent, datasetId: '8' })).toBe(true);
    expect(JSON.parse(storage.read()).datasetId).toBe('8');
    storage.clear();
    expect(storage.read()).toBeNull();
  });

  it('remembers in memory only that an intent was saved, until it is cleared', () => {
    expect(storage.hasSavedIntent()).toBe(false);
    storage.save(intent);
    expect(storage.hasSavedIntent()).toBe(true);
    sessionStorage.clear();
    expect(storage.read()).toBeNull();
    expect(storage.hasSavedIntent()).toBe(true);
    storage.clear();
    expect(storage.hasSavedIntent()).toBe(false);
  });
  it('does not mark an intent as saved when storage throws', () => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', 'QuotaExceededError');
    });
    storage.save(intent);
    expect(storage.hasSavedIntent()).toBe(false);
  });
  it.each(['QuotaExceededError', 'SecurityError'])('does not redirect when storage throws %s', (name) => {
    jest.spyOn(Storage.prototype, 'setItem').mockImplementation(() => {
      throw new DOMException('Blocked', name);
    });
    expect(storage.save(intent)).toBe(false);
  });
});
