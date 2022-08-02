import { HttpClientTestingModule } from '@angular/common/http/testing';
import { TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { LoginService } from '@app/services/login-service';
import { NotificationsService } from '@app/services/notifications.service';
import { UserService } from '@app/services/user.service';
import { DiscourseService } from '@app/user/forum/discourse.service';
import { TranslateModule } from '@ngx-translate/core';
import { CookieService } from 'ngx-cookie-service';
import { LocalStorageService } from 'ngx-localstorage';

class LocalStorageServiceStub {}

describe('DiscourseService', () => {
  let service: DiscourseService;
  let userService: UserService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [
        DiscourseService,
        UserService,
        NotificationsService,
        CookieService,
        LoginService,
        { provide: LocalStorageService, useClass: LocalStorageServiceStub },
      ],
    });

    service = TestBed.inject(DiscourseService);
    userService = TestBed.inject(UserService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should sets discourse credentials', () => {
    spyOn(userService, 'getTokenData').and.returnValue({ user: { discourse_api_key: 'apiKey', discourse_user_name: 'userName' } });
    service.setDiscourseCredentials();
    expect(service.apiKey).toEqual('apiKey');
    expect(service.apiUsername).toEqual('userName');
  });

  it('should gets badges', () => {
    service.getBadges().subscribe(value => {
      expect(value).toBeGreaterThan(0);
    });
  });

  it('should gets notifications', () => {
    service.getNotifications().subscribe(value => {
      expect(value).toBeGreaterThan(0);
    });
  });

  it('should gets notifications with badges', () => {
    service.getNotificationsWithBadges().subscribe(value => {
      expect(value).toBeGreaterThan(0);
    });
  });

  it('should gets latest topics', () => {
    service.getLatestTopics().subscribe(value => {
      expect(value).toBeGreaterThan(0);
    });
  });

  it('should gets latest topics with categories', () => {
    service.getLatestTopicsWithCategories().subscribe(value => {
      expect(value).toBeGreaterThan(0);
    });
  });

  it('should marks notifications as read', () => {
    service.markNotificationsAsRead().subscribe(value => {
      expect(value).toBeGreaterThan(0);
    });
  });
});
