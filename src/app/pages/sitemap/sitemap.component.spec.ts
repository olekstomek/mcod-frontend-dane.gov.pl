import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap/modal';

import { AppTestingModule } from '@app/app.testing.module';
import { SitemapComponent } from '@app/pages/sitemap/sitemap.component';
import { SeoService } from '@app/services/seo.service';
import { SharedModule } from '@app/shared/shared.module';

class BsModalServiceStub {}

describe('SitemapComponent', () => {
  let component: SitemapComponent;
  let fixture: ComponentFixture<SitemapComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), LocalizeRouterModule.forRoot([]), SharedModule, SitemapComponent],
      providers: [
        { provide: SeoService, useValue: { setPageTitleByTranslationKey: jest.fn() } },
        { provide: BsModalService, useClass: BsModalServiceStub },
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

  it('should render a contact link', () => {
    createComponent();

    expect(fixture.nativeElement.querySelector('.sitemap-contact-link')).toBeTruthy();
  });
});
