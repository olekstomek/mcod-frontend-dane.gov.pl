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
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { CONTACT_PAGE_LOCALIZED_ROUTE } from '@app/shared/forms/form-pages/contact-form/contact-page.config';
import { LocalizeRouterService } from '@gilsdav/ngx-translate-router';

class AnchorElementMock {
  private readonly listeners = new Map<string, (event: Event) => void>();

  addEventListener(eventName: string, listener: (event: Event) => void): void {
    this.listeners.set(eventName, listener);
  }

  removeEventListener(eventName: string): void {
    this.listeners.delete(eventName);
  }

  click(): void {
    this.listeners.get('click')?.({ preventDefault: jest.fn() } as unknown as Event);
  }
}

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let flagEnabled: boolean;
  let writeUsLinkElem: AnchorElementMock;
  let modalServiceMock: { show: jest.Mock; onHidden: EventEmitter<void>; hide: jest.Mock; open: jest.Mock };
  let router!: Router;
  let translateRouteMock: jest.Mock;
  let querySelectorSpy: jest.SpyInstance;

  beforeEach(() => {
    const originalQuerySelector = document.querySelector.bind(document);

    flagEnabled = false;
    writeUsLinkElem = new AnchorElementMock();
    translateRouteMock = jest.fn((route: string[]) => route);
    modalServiceMock = {
      onHidden: new EventEmitter(),
      hide: jest.fn(),
      open: jest.fn(),
      show: jest.fn(),
    };

    querySelectorSpy = jest.spyOn(document, 'querySelector').mockImplementation((selector: string) => {
      if (selector === 'a.page-footer__list-item.btn-write-us') {
        return writeUsLinkElem as unknown as Element;
      }
      if (selector === 'a.page-footer__list-item.btn-link-rodo') {
        return new AnchorElementMock() as unknown as Element;
      }
      return originalQuerySelector(selector);
    });

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
        {
          provide: FeatureFlagService,
          useValue: { validateFlagSync: () => flagEnabled },
        },
        { provide: PLATFORM_ID, useValue: 'server' },
        { provide: LocalizeRouterService, useValue: { translateRoute: translateRouteMock } },
      ],
    })
      .overrideProvider(BsModalService, { useValue: modalServiceMock })
      .overrideComponent(FooterComponent, {
        set: {
          template: `<ng-template #rodoModalTemplate></ng-template><ng-template #writeUsModalTemplate></ng-template>`,
        },
      })
      .compileComponents();
  });

  afterEach(() => {
    querySelectorSpy.mockRestore();
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

  it('should open the legacy contact modal when the new contact page flag is disabled', () => {
    createComponent();

    writeUsLinkElem.click();

    expect(modalServiceMock.show).toHaveBeenCalledTimes(1);
    expect(router.navigate).not.toHaveBeenCalled();
  });

  it('should navigate to the contact page when the new contact page flag is enabled', () => {
    flagEnabled = true;

    createComponent();

    writeUsLinkElem.click();

    expect(router.navigate).toHaveBeenCalledWith([CONTACT_PAGE_LOCALIZED_ROUTE]);
    expect(translateRouteMock).toHaveBeenCalledWith([CONTACT_PAGE_LOCALIZED_ROUTE]);
    expect(modalServiceMock.show).not.toHaveBeenCalled();
  });
});
