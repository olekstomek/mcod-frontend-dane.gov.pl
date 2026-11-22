import { TestBed } from '@angular/core/testing';
import { FavouriteErrorHandler } from './favourite-error-handler';
import { FavouriteToastService } from './favourite-toast.service';
describe('FavouriteErrorHandler', () => {
  const toasts = { show: jest.fn() };
  let handler: FavouriteErrorHandler;
  beforeEach(() => {
    jest.clearAllMocks();
    TestBed.configureTestingModule({ providers: [{ provide: FavouriteToastService, useValue: toasts }] });
    handler = TestBed.inject(FavouriteErrorHandler);
  });
  it.each([
    [409, 'add', 'Favorites.Toasts.AlreadyExists'],
    [409, 'remove', 'Favorites.Toasts.AlreadyRemoved'],
    [404, 'add', 'Favorites.Toasts.AccessError'],
    [404, 'remove', 'Favorites.Toasts.AlreadyRemoved'],
    [429, 'add', 'Favorites.Toasts.TooManyRequests'],
    [429, 'remove', 'Favorites.Toasts.TooManyRequests'],
    [500, 'add', 'Favorites.Toasts.AddError'],
    [0, 'remove', 'Favorites.Toasts.AddError'],
  ] as const)('maps %s (%s) to an info toast %s', (status, operation, key) => {
    handler.handle({ status }, operation);
    expect(toasts.show).toHaveBeenCalledWith('info', key);
  });
  it('skips 401 (handled by the interceptor)', () => {
    handler.handle({ status: 401 }, 'add');
    expect(toasts.show).not.toHaveBeenCalled();
  });
  it('shows the generic error when there is no error object', () => {
    handler.handle(null, 'add');
    expect(toasts.show).toHaveBeenCalledWith('info', 'Favorites.Toasts.AddError');
  });
});
