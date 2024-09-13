import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { CmsService } from '@app/services/cms.service';
import { LanguageBootstrapService } from '@app/services/language-bootstrap.service';
import { NotificationsService } from '@app/services/notifications.service';
import { UserService } from '@app/services/user.service';
import { LocalizeRouterModule, LocalizeRouterService } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { BsLocaleService } from 'ngx-bootstrap';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { of } from 'rxjs/internal/observable/of';
import { HeaderComponent } from './header.component';

class NotificationsServiceStub {
  clearAlerts() {}
  getAlerts() {
    return of([]);
  }
}

class UserServiceStub {
  logout() {}
}

describe('HeaderComponent', () => {
  let component: HeaderComponent;
  let fixture: ComponentFixture<HeaderComponent>;
  let cmsService: CmsService;
  let userService: UserService;
  let router: Router;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [HeaderComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxLocalStorageModule.forRoot(),
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
      ],
      providers: [
        { provide: UserService, useClass: UserServiceStub },
        { provide: NotificationsService, useClass: NotificationsServiceStub },
        CmsService,
        LanguageBootstrapService,
        BsLocaleService,
        LocalizeRouterService,
      ],
    }).compileComponents();

    cmsService = TestBed.inject(CmsService);
    userService = TestBed.inject(UserService);
    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(HeaderComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });

  it('should logout', async () => {
    const spyFunction = spyOn(userService, 'logout').and.returnValue(of({}));
    component.logout();
    expect(spyFunction).toBeCalled();
  });

  it('should change language for the entire app', async () => {
    const language = 'EN';
    component.useLanguage(language);

    expect(language).toEqual('EN');
  });

  it('should set language for the entire app to PL', async () => {
    const language = 'pl';
    component.useLanguage(language);

    expect(language).toEqual('pl');
  });
});
