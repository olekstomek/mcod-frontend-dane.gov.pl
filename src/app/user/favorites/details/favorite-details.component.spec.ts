import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoriteDetailsComponent } from './favorite-details.component';
import { ObserveService, LikesApiResponse } from '@app/services/observe.service';
import { ListViewDetailsService } from '@app/services/list-view-details.service';
import { LoginService } from '@app/services/login-service';
import { DatasetResultsComponent } from '@app/pages/dataset/dataset-results/dataset-results.component';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { TranslateModule, TranslateService } from '@ngx-translate/core';
import { Title } from '@angular/platform-browser';
import { APP_CONFIG } from '@app/app.config';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { provideRouter } from '@angular/router';
import { of, throwError } from 'rxjs';
import { ApiModel } from '@app/services/api/api-model';
import { Component, input } from '@angular/core';
import { ISearchResult } from '@app/services/models/search';
import { SeoService } from '@app/services/seo.service';

@Component({
  selector: 'app-notifications-server',
  standalone: true,
  template: '',
})
class MockNotificationsServerComponent {}

@Component({
  selector: 'app-dataset-results',
  standalone: true,
  template: '',
})
class MockDatasetResultsComponent {
  readonly isUserLoggedIn = input<boolean | null>(false);
  readonly items = input<ISearchResult[] | null>(null);
  readonly useConfirmation = input<boolean>(false);
}

describe('FavoriteDetailsComponent', () => {
  let component: FavoriteDetailsComponent;
  let fixture: ComponentFixture<FavoriteDetailsComponent>;
  let observeServiceMock: jest.Mocked<ObserveService>;
  let listViewDetailsServiceMock: jest.Mocked<ListViewDetailsService>;
  let loginServiceMock: jest.Mocked<LoginService>;

  const mockApiResponse: LikesApiResponse = {
    data: [
      {
        id: '1',
        attributes: {
          title: 'Test Dataset',
          slug: 'test-dataset',
          model: ApiModel.DATASET,
        },
      },
    ],
    meta: {
      count: 1,
    },
  } as unknown as LikesApiResponse;

  const seoServiceMock = { setPageTitleByTranslationKey: jest.fn() };

  beforeEach(async () => {
    observeServiceMock = {
      getLikes: jest.fn().mockReturnValue(of(mockApiResponse)),
    } as unknown as jest.Mocked<ObserveService>;

    listViewDetailsServiceMock = {
      extendViewDetails: jest.fn().mockImplementation((items) => items),
    } as unknown as jest.Mocked<ListViewDetailsService>;

    loginServiceMock = {
      loggedIn: of(true),
    } as unknown as jest.Mocked<LoginService>;

    seoServiceMock.setPageTitleByTranslationKey.mockClear();

    await TestBed.configureTestingModule({
      imports: [FavoriteDetailsComponent, TranslateModule.forRoot(), LocalizeRouterModule.forRoot([])],
      providers: [
        provideRouter([]),
        { provide: ObserveService, useValue: observeServiceMock },
        { provide: ListViewDetailsService, useValue: listViewDetailsServiceMock },
        { provide: LoginService, useValue: loginServiceMock },
        { provide: SeoService, useValue: seoServiceMock },
      ],
    })
      .overrideComponent(FavoriteDetailsComponent, {
        remove: {
          imports: [NotificationsServerComponent, DatasetResultsComponent],
        },
        add: {
          imports: [MockNotificationsServerComponent, MockDatasetResultsComponent],
        },
      })
      .compileComponents();

    fixture = TestBed.createComponent(FavoriteDetailsComponent);
    component = fixture.componentInstance;
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should fetch liked items on ngOnInit', () => {
    fixture.detectChanges();

    expect(observeServiceMock.getLikes).toHaveBeenCalledWith(
      ApiModel.DATASET,
      expect.objectContaining({ page: 1, per_page: 5, sort: '-date' }),
    );
    expect(component['items']()).toBeTruthy();
    expect(component['count']()).toBe(1);
  });

  it('should set page title once on init', () => {
    fixture.detectChanges();

    expect(seoServiceMock.setPageTitleByTranslationKey).toHaveBeenCalledTimes(1);
    expect(seoServiceMock.setPageTitleByTranslationKey).toHaveBeenCalledWith([
      'Favorites.Dashboard.NavLink',
      'MyDashboard.Self',
    ]);
  });

  it('should set page title even when getLikes fails', () => {
    observeServiceMock.getLikes.mockReturnValue(throwError(() => new Error('fail')));

    fixture.detectChanges();

    expect(seoServiceMock.setPageTitleByTranslationKey).toHaveBeenCalledWith([
      'Favorites.Dashboard.NavLink',
      'MyDashboard.Self',
    ]);
  });

  it('should update params and refetch items when updateParams is called', () => {
    fixture.detectChanges();

    component['updateParams']({ page: 2 });

    expect(observeServiceMock.getLikes).toHaveBeenCalledWith(ApiModel.DATASET, expect.objectContaining({ page: 2 }));
  });

  it('should correctly detect if there are no items', () => {
    component['items'].set([]);
    expect(component['hasNoItems']()).toBe(true);

    component['items'].set(null);
    expect(component['hasNoItems']()).toBe(false);
  });

  it('should handle favorite change by updating pagination and fetching items', () => {
    component['count'].set(6);
    component['params'].set({ page: 2, per_page: 5, sort: '-date' });

    component['onChildFavoriteChanged']();

    expect(observeServiceMock.getLikes).toHaveBeenCalled();
  });
});

describe('FavoriteDetailsComponent page title (real SeoService)', () => {
  it('should set translated title and update it after language change', async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteDetailsComponent, TranslateModule.forRoot(), LocalizeRouterModule.forRoot([])],
      providers: [
        provideRouter([]),
        SeoService,
        {
          provide: ObserveService,
          useValue: { getLikes: jest.fn().mockReturnValue(of({ data: [], meta: { count: 0 } })) },
        },
        { provide: ListViewDetailsService, useValue: { extendViewDetails: (i) => i } },
        { provide: LoginService, useValue: { loggedIn: of(true) } },
      ],
    })
      .overrideComponent(FavoriteDetailsComponent, {
        remove: { imports: [NotificationsServerComponent, DatasetResultsComponent] },
        add: { imports: [MockNotificationsServerComponent, MockDatasetResultsComponent] },
      })
      .compileComponents();

    const translate = TestBed.inject(TranslateService);
    translate.setTranslation('pl', {
      Favorites: { Dashboard: { NavLink: 'Ulubione zbiory' } },
      MyDashboard: { Self: 'Mój pulpit' },
    });
    translate.setTranslation('en', {
      Favorites: { Dashboard: { NavLink: 'Favourite datasets' } },
      MyDashboard: { Self: 'My dashboard' },
    });
    translate.use('pl');

    const fixture = TestBed.createComponent(FavoriteDetailsComponent);
    fixture.detectChanges();

    const title = TestBed.inject(Title);
    expect(title.getTitle()).toBe(`Ulubione zbiory - Mój pulpit - ${APP_CONFIG.name}`);

    translate.use('en');
    expect(title.getTitle()).toBe(`Favourite datasets - My dashboard - ${APP_CONFIG.name}`);
  });
});
