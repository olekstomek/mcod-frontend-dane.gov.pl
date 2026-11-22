import { TestBed } from '@angular/core/testing';
import { DefaultUrlSerializer, NavigationEnd, Router } from '@angular/router';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { of, Subject, throwError } from 'rxjs';

import { DatasetService } from '@app/services/dataset.service';
import { LoginService } from '@app/services/login-service';
import { FavouriteToastService } from './favourite-toast.service';
import { UserService } from '@app/services/user.service';
import { FavouriteActionService } from './favourite-action.service';
import { FavouritePostLoginService } from './favourite-post-login.service';

/**
 * Integration of the whole mechanism with real services (storage, validator, action, post-login);
 * only the router, user, notifications and the HTTP layer (DatasetService) are mocked.
 */
describe('Favourite intent flow (click -> login -> return -> add)', () => {
  const listUrl = '/pl/dataset?page=3&sort=-modified';
  const detailsUrl = '/pl/dataset/123,some-slug';
  let events: Subject<NavigationEnd>;
  let currentUrl: string;
  let loggedIn: boolean;
  let login: LoginService;
  let actions: FavouriteActionService;
  let postLogin: FavouritePostLoginService;

  const router = {
    get url() {
      return currentUrl;
    },
    events: undefined as unknown,
    parseUrl: (url: string) => new DefaultUrlSerializer().parse(url),
    navigate: jest.fn(),
    navigateByUrl: jest.fn(),
  };
  const notifications = { show: jest.fn() };
  const datasetService = { markDatasetAsLiked: jest.fn() };

  const navigate = (url: string) => {
    currentUrl = url;
    events.next(new NavigationEnd(1, url, url));
  };
  const intentInStorage = () => sessionStorage.getItem('otd_favourite_intent');

  /** user clicked "add to favourites", logged in by e-mail and landed on the dashboard */
  const clickLoginAndLand = (fromUrl: string, position: number) => {
    navigate(fromUrl);
    actions.request('123', position);
    navigate('/pl/user/login');
    loggedIn = true;
    login.next(true);
    navigate('/pl/user/dashboard/desktop');
  };

  beforeEach(() => {
    jest.clearAllMocks();
    sessionStorage.clear();
    events = new Subject<NavigationEnd>();
    router.events = events.asObservable();
    router.navigateByUrl.mockImplementation((url: string) => {
      navigate(url);
      return Promise.resolve(true);
    });
    loggedIn = false;
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: LocalizeRouterService, useValue: { translateRoute: () => ['/pl/user/login'] } },
        { provide: UserService, useValue: { isLoggedIn: () => loggedIn } },
        { provide: FavouriteToastService, useValue: notifications },
        { provide: DatasetService, useValue: datasetService },
      ],
    });
    login = TestBed.inject(LoginService);
    actions = TestBed.inject(FavouriteActionService);
    postLogin = TestBed.inject(FavouritePostLoginService);
    postLogin.start();
  });

  it('saves the list state and goes to login for a not logged in user, without calling the API', () => {
    navigate(listUrl);
    actions.request('123', 5);
    expect(JSON.parse(intentInStorage())).toEqual({
      datasetId: '123',
      listPosition: 5,
      returnUrl: listUrl,
      createdAt: expect.any(Number),
    });
    expect(router.navigate).toHaveBeenCalledWith(['/pl/user/login']);
    expect(datasetService.markDatasetAsLiked).not.toHaveBeenCalled();
  });

  it('returns to the saved list, adds the dataset once and clears the entry (KA-02)', () => {
    datasetService.markDatasetAsLiked.mockReturnValue(of(8));
    clickLoginAndLand(listUrl, 5);

    expect(router.navigateByUrl).toHaveBeenCalledWith(listUrl);
    expect(postLogin.readyDatasetId()).toBe('123');

    // the list component reports back after rendering
    const scroll = jest.fn();
    const onAdded = jest.fn();
    postLogin.finish('123', scroll, onAdded);

    expect(scroll).toHaveBeenCalledTimes(1);
    expect(intentInStorage()).toBeNull();
    expect(datasetService.markDatasetAsLiked).toHaveBeenCalledWith('123');
    expect(onAdded).toHaveBeenCalledWith(8);
    expect(postLogin.readyDatasetId()).toBeNull();

    // the entry is single-use
    postLogin.finish('123', scroll, onAdded);
    expect(datasetService.markDatasetAsLiked).toHaveBeenCalledTimes(1);
  });

  it('works the same way from the dataset details page (KA-01)', () => {
    datasetService.markDatasetAsLiked.mockReturnValue(of(2));
    clickLoginAndLand(detailsUrl, 1);
    expect(router.navigateByUrl).toHaveBeenCalledWith(detailsUrl);

    const onAdded = jest.fn();
    postLogin.finish('123', jest.fn(), onAdded);
    expect(onAdded).toHaveBeenCalledWith(2);
  });

  it('treats 409 as already added: button state updates and an info message is shown (KA-04)', () => {
    datasetService.markDatasetAsLiked.mockReturnValue(throwError(() => ({ status: 409 })));
    clickLoginAndLand(listUrl, 5);

    const onAdded = jest.fn();
    postLogin.finish('123', jest.fn(), onAdded);
    expect(onAdded).toHaveBeenCalledWith(null);
    expect(notifications.show).toHaveBeenCalledWith('info', 'Favorites.Toasts.AlreadyExists');
  });

  it('does not touch the list view for another dataset', () => {
    datasetService.markDatasetAsLiked.mockReturnValue(of(1));
    clickLoginAndLand(listUrl, 5);
    const onAdded = jest.fn();
    postLogin.finish('999', jest.fn(), onAdded);
    expect(datasetService.markDatasetAsLiked).not.toHaveBeenCalled();
    expect(onAdded).not.toHaveBeenCalled();
  });

  it('drops an expired entry: no return, no API call, error message (KA-03)', () => {
    jest.spyOn(Date, 'now').mockReturnValue(1_000_000);
    navigate(listUrl);
    actions.request('123', 5);
    jest.spyOn(Date, 'now').mockReturnValue(1_000_000 + 10 * 60 * 1000 + 1);
    navigate('/pl/user/login');
    loggedIn = true;
    login.next(true);
    navigate('/pl/user/dashboard/desktop');

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(datasetService.markDatasetAsLiked).not.toHaveBeenCalled();
    expect(intentInStorage()).toBeNull();
    expect(notifications.show).toHaveBeenCalledWith('danger', 'Favorites.Toasts.AddError');
    jest.restoreAllMocks();
  });

  it.each([
    ['unsafe return path', { returnUrl: 'https://evil.com' }],
    ['malformed dataset id', { datasetId: '../5' }],
    ['missing fields', { returnUrl: undefined }],
  ])('rejects a tampered entry (%s) without calling the API (KA-05)', (_name, change) => {
    navigate(listUrl);
    actions.request('123', 5);
    sessionStorage.setItem('otd_favourite_intent', JSON.stringify({ ...JSON.parse(intentInStorage()), ...change }));
    navigate('/pl/user/login');
    loggedIn = true;
    login.next(true);
    navigate('/pl/user/dashboard/desktop');

    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(datasetService.markDatasetAsLiked).not.toHaveBeenCalled();
    expect(intentInStorage()).toBeNull();
    expect(notifications.show).toHaveBeenCalledWith('danger', 'Favorites.Toasts.AddError');
  });

  it('drops the entry when the user cancels or fails the WK login (KA-05)', () => {
    navigate(listUrl);
    actions.request('123', 5);
    navigate('/pl/user/logingovpl-error?logingovpl=login-error');

    expect(intentInStorage()).toBeNull();
    expect(notifications.show).not.toHaveBeenCalled();
    expect(datasetService.markDatasetAsLiked).not.toHaveBeenCalled();
  });

  it('shows an error when the entry vanished between the click and the login (KA-05)', () => {
    navigate(listUrl);
    actions.request('123', 5);
    sessionStorage.clear();
    navigate('/pl/user/login');
    loggedIn = true;
    login.next(true);
    navigate('/pl/user/dashboard/desktop');

    expect(notifications.show).toHaveBeenCalledWith('danger', 'Favorites.Toasts.AddError');
    expect(datasetService.markDatasetAsLiked).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });

  it('does not show any message for a regular login without an intent', () => {
    navigate('/pl/user/login');
    loggedIn = true;
    login.next(true);
    navigate('/pl/user/dashboard/desktop');

    expect(notifications.show).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
});
