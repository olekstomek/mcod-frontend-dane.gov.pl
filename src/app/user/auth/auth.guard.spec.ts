import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationsService } from '@app/services/notifications.service';
import { UserStateService } from '@app/services/user-state.service';
import { UserService } from '@app/services/user.service';
import { LocalizeRouterModule, LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { of } from 'rxjs/internal/observable/of';
import { AuthGuard } from './auth.guard';
import { ActivatedRouteSnapshot, RouterStateSnapshot } from '@angular/router';

function fakeRouterState(url: string): RouterStateSnapshot {
  return {
    url,
  } as RouterStateSnapshot;
}

describe('AuthGuard', () => {
  let guard: AuthGuard;
  let userStateService: UserStateService;
  const dummyRoute = {} as ActivatedRouteSnapshot;
  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxLocalStorageModule.forRoot(),
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
      ],
      providers: [AuthGuard, UserService, LocalizeRouterService, UserStateService, NotificationsService],
    });

    guard = TestBed.inject(AuthGuard);
    userStateService = TestBed.inject(UserStateService);
  });

  it('should be created', () => {
    expect(guard).toBeTruthy();
  });

  it('should determines whether route can be activated', async () => {
    const fakeUrl = '/';
    guard.canActivate(dummyRoute, fakeRouterState(fakeUrl));
  });

  it('should checks login for specified url and redirects user', async () => {
    spyOn(userStateService, 'getCurrentUser').and.returnValue(of({}));
    guard.checkLogin('https://dev.dane.gov.pl/pl/user/dashboard/desktop').subscribe(value => {
      expect(value).toBeTruthy();
    });
  });
});
