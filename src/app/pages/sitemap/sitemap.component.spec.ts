import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { AppTestingModule } from '@app/app.testing.module';
import { SitemapComponent } from '@app/pages/sitemap/sitemap.component';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { SeoService } from '@app/services/seo.service';
import { SharedModule } from '@app/shared/shared.module';

class BsModalServiceStub {}

class SeoServiceStub {
  setPageTitleByTranslationKey() {}
}

describe('SitemapComponent', () => {
  let component: SitemapComponent;
  let fixture: ComponentFixture<SitemapComponent>;
  let flagEnabled: boolean;

  beforeEach(() => {
    flagEnabled = false;

    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), LocalizeRouterModule.forRoot([]), SharedModule, SitemapComponent],
      providers: [
        { provide: SeoService, useClass: SeoServiceStub },
        { provide: BsModalService, useClass: BsModalServiceStub },
        {
          provide: FeatureFlagService,
          useValue: {
            validateFlagSync: () => flagEnabled,
          },
        },
        importProvidersFrom(AppTestingModule),
      ],
    }).compileComponents();
  });

  function createComponent() {
    fixture = TestBed.createComponent(SitemapComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  }

  it('should create', async () => {
    createComponent();
    expect(component).toBeDefined();
  });

  it('should render a contact link when the new contact page flag is enabled', () => {
    flagEnabled = true;

    createComponent();

    expect(fixture.nativeElement.querySelector('.sitemap-contact-link')).toBeTruthy();
    expect(fixture.nativeElement.querySelector('app-write-us-info')).toBeFalsy();
  });

  it('should render the legacy contact modal trigger when the new contact page flag is disabled', () => {
    createComponent();

    expect(fixture.nativeElement.querySelector('.sitemap-contact-link')).toBeFalsy();
    expect(fixture.nativeElement.querySelector('app-write-us-info')).toBeTruthy();
  });
});
