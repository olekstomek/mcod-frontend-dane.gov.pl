import { TestBed } from '@angular/core/testing';
import { DefaultUrlSerializer, NavigationEnd, Router } from '@angular/router';
import { Subject } from 'rxjs';

import { LoginService } from '@app/services/login-service';
import { FavouriteToastService } from './favourite-toast.service';
import { UserService } from '@app/services/user.service';
import { FavouriteActionService } from './favourite-action.service';
import { FavouriteIntentStorageService } from './favourite-intent-storage.service';
import { FavouriteIntentValidator } from './favourite-intent-validator';
import { FavouritePostLoginService } from './favourite-post-login.service';

describe('FavouritePostLoginService', () => {
  const events = new Subject<NavigationEnd>();
  const intent = { datasetId: '123', returnUrl: '/pl/dataset?page=3', listPosition: 5, createdAt: Date.now() };
  const storage = { read: jest.fn(), clear: jest.fn(), hasSavedIntent: jest.fn() };
  const notifications = { show: jest.fn() };
  const actions = { add: jest.fn() };
  const user = { isLoggedIn: jest.fn().mockReturnValue(true) };
  const router = {
    events: events.asObservable(),
    parseUrl: (url: string) => new DefaultUrlSerializer().parse(url),
    navigateByUrl: jest.fn().mockResolvedValue(true),
  };
  let login: LoginService;
  let resume: FavouritePostLoginService;

  const navigate = (url: string) => events.next(new NavigationEnd(1, url, url));

  beforeEach(() => {
    jest.clearAllMocks();
    storage.read.mockReturnValue(JSON.stringify(intent));
    storage.hasSavedIntent.mockReturnValue(false);
    user.isLoggedIn.mockReturnValue(true);
    TestBed.configureTestingModule({
      providers: [
        { provide: Router, useValue: router },
        { provide: UserService, useValue: user },
        { provide: FavouriteIntentStorageService, useValue: storage },
        { provide: FavouriteToastService, useValue: notifications },
        { provide: FavouriteActionService, useValue: actions },
      ],
    });
    login = TestBed.inject(LoginService);
    resume = TestBed.inject(FavouritePostLoginService);
    expect(TestBed.inject(FavouriteIntentValidator)).toBeTruthy();
    resume.start();
  });

  it('waits for email dashboard navigation, then scrolls and clears before the action', () => {
    login.next(true);
    expect(storage.read).not.toHaveBeenCalled();
    navigate('/pl/user/dashboard/desktop');
    expect(router.navigateByUrl).toHaveBeenCalledWith(intent.returnUrl);
    expect(storage.clear).not.toHaveBeenCalled();
    navigate(intent.returnUrl);
    const scroll = jest.fn();
    resume.finish('123', scroll, jest.fn());
    expect(scroll).toHaveBeenCalledTimes(1);
    expect(storage.clear).toHaveBeenCalledTimes(1);
    expect(actions.add).toHaveBeenCalledWith('123', expect.any(Function));
    resume.finish('123', scroll, jest.fn());
    expect(actions.add).toHaveBeenCalledTimes(1);
  });

  it('resumes WK success without an email login event', () => {
    navigate('/pl/user/dashboard/desktop?logingovpl=login-success');
    expect(router.navigateByUrl).toHaveBeenCalledWith(intent.returnUrl);
  });

  it('drops the intent on WK login error without any UI action or API call', () => {
    navigate('/pl/user/logingovpl-error?logingovpl=login-error');
    // `events` is shared and earlier tests leave subscribers, so only check that the entry was removed
    expect(storage.clear).toHaveBeenCalled();
    expect(notifications.show).not.toHaveBeenCalled();
    expect(actions.add).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
  it('keeps the intent on other WK notifications (e.g. link error)', () => {
    navigate('/pl/user/logingovpl-error?logingovpl=link-error');
    expect(storage.clear).not.toHaveBeenCalled();
  });
  it('leaves the dashboard untouched without an intent', () => {
    storage.read.mockReturnValue(null);
    login.next(true);
    navigate('/pl/user/dashboard/desktop');
    expect(storage.clear).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(notifications.show).not.toHaveBeenCalled();
  });

  it('alerts and does not call the API when the entry vanished after the click', () => {
    storage.read.mockReturnValue(null);
    storage.hasSavedIntent.mockReturnValue(true);
    login.next(true);
    navigate('/pl/user/dashboard/desktop');
    expect(storage.clear).toHaveBeenCalled();
    expect(notifications.show).toHaveBeenCalledWith('danger', 'Favorites.Toasts.AddError');
    expect(actions.add).not.toHaveBeenCalled();
    expect(router.navigateByUrl).not.toHaveBeenCalled();
  });
  it('clears invalid intent and alerts on the dashboard', () => {
    storage.read.mockReturnValue('{');
    login.next(true);
    navigate('/pl/user/dashboard/desktop');
    expect(storage.clear).toHaveBeenCalledTimes(1);
    expect(router.navigateByUrl).not.toHaveBeenCalled();
    expect(notifications.show).toHaveBeenCalledWith('danger', 'Favorites.Toasts.AddError');
  });

  it('does not call the API when restored results omit the target', () => {
    login.next(true);
    navigate('/pl/user/dashboard/desktop');
    navigate(intent.returnUrl);
    resume.discardMissing();
    expect(storage.clear).toHaveBeenCalledTimes(1);
    expect(actions.add).not.toHaveBeenCalled();
  });
});
