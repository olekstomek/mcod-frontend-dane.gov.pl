import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { of, throwError } from 'rxjs';

import { FavouriteToastService } from './favourite-toast.service';
import { UserService } from '@app/services/user.service';
import { FAVOURITE_API, FavouriteActionService } from './favourite-action.service';
import { FavouriteIntentStorageService } from './favourite-intent-storage.service';

describe('FavouriteActionService', () => {
  const router = { url: '/pl/dataset?page=3', navigate: jest.fn() };
  const storage = { save: jest.fn() };
  const notifications = { show: jest.fn() };
  const user = { isLoggedIn: jest.fn() };
  const api = { add: jest.fn() };
  let actions: FavouriteActionService;

  beforeEach(() => {
    jest.clearAllMocks();
    user.isLoggedIn.mockReturnValue(false);
    storage.save.mockReturnValue(true);
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: LocalizeRouterService, useValue: { translateRoute: () => ['/pl/user/login'] } },
        { provide: FavouriteIntentStorageService, useValue: storage },
        { provide: FavouriteToastService, useValue: notifications },
        { provide: UserService, useValue: user },
        { provide: FAVOURITE_API, useValue: api },
      ],
    });
    actions = TestBed.inject(FavouriteActionService);
  });

  it('stores the full list URL and position before navigating without redirect', () => {
    actions.request('123', 5);
    expect(storage.save).toHaveBeenCalledWith({
      datasetId: '123',
      listPosition: 5,
      returnUrl: '/pl/dataset?page=3',
      createdAt: expect.any(Number),
    });
    expect(router.navigate).toHaveBeenCalledWith(['/pl/user/login']);
  });

  it('does not navigate when session storage fails', () => {
    storage.save.mockReturnValue(false);
    actions.request('123', 5);
    expect(router.navigate).not.toHaveBeenCalled();
    expect(notifications.show).toHaveBeenCalledWith('danger', 'Favorites.Toasts.AddError');
  });

  it('treats 409 from POST as already added: updates state and shows info', () => {
    api.add.mockReturnValue(throwError(() => ({ status: 409 })));
    const onAdded = jest.fn();
    actions.add('123', onAdded);
    expect(api.add).toHaveBeenCalledTimes(1);
    expect(onAdded).toHaveBeenCalledTimes(1);
    expect(notifications.show).toHaveBeenCalledWith('info', 'Favorites.Toasts.AlreadyExists');
  });
  it('updates state with likes count only after a successful POST', () => {
    api.add.mockReturnValue(of(7));
    const onAdded = jest.fn();
    actions.add('123', onAdded);
    expect(api.add).toHaveBeenCalledWith('123');
    expect(onAdded).toHaveBeenCalledWith(7);
  });
  it('keeps the button unchanged and alerts when the POST fails', () => {
    api.add.mockReturnValue(throwError(() => ({ status: 500 })));
    const onAdded = jest.fn();
    actions.add('123', onAdded);
    expect(onAdded).not.toHaveBeenCalled();
    expect(notifications.show).toHaveBeenCalledWith('danger', 'Favorites.Toasts.AddError');
  });
});
