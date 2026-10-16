import { EventEmitter, importProvidersFrom, PLATFORM_ID } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';
import { of } from 'rxjs';
import { FooterComponent } from './footer.component';

import { AppTestingModule } from '@app/app.testing.module';
import { FooterLogosFilterService } from '@app/layout/footer/footer-logos-filter.service';
import { CmsService } from '@app/services/cms.service';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let modalServiceMock: { show: jest.Mock; onHidden: EventEmitter<void>; hide: jest.Mock; open: jest.Mock };
  let router!: Router;
  let translateRouteMock: jest.Mock;

  beforeEach(() => {
    translateRouteMock = jest.fn((route: string[]) => route);
    modalServiceMock = {
      onHidden: new EventEmitter(),
      hide: jest.fn(),
      open: jest.fn(),
      show: jest.fn(),
    };

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), FooterComponent],
      providers: [
        importProvidersFrom(AppTestingModule),
        {
          provide: CmsService,
          useValue: {
            elementFooterNavIsExist: of(true),
            getHomePageWidgets: jest.fn().mockReturnValue(of({ footer_nav: { blocks: [] }, footer_logos: [] })),
          },
        },
        {
          provide: FooterLogosFilterService,
          useValue: { filter: jest.fn().mockReturnValue(of([])) },
        },
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: LocalizeRouterService, useValue: { translateRoute: translateRouteMock } },
      ],
    })
      .overrideProvider(BsModalService, { useValue: modalServiceMock })
      .overrideComponent(FooterComponent, {
        set: {
          template: `<ng-template #rodoModalTemplate></ng-template>`,
        },
      })
      .compileComponents();
  });

  function createComponent() {
    router = TestBed.inject(Router);
    jest.spyOn(router, 'navigate').mockResolvedValue(true);

    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', () => {
    createComponent();
    expect(component).toBeDefined();
  });
});
