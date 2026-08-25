import { Component, importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { provideRouter, Router, RouterOutlet } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';

import { AppTestingModule } from '@app/app.testing.module';
import { PageNotFoundComponent } from '@app/page-not-found/page-not-found.component';
import { ContactFormComponent } from '@app/shared/forms/form-pages/contact-form/contact-form.component';
import { CONTACT_PAGE_ROUTE, contactPageCanMatch } from '@app/shared/forms/form-pages/contact-form/contact-page.config';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { SeoService } from '@app/services/seo.service';

@Component({
  selector: 'app-test-router-host',
  template: '<router-outlet></router-outlet>',
  imports: [RouterOutlet],
  standalone: true,
})
class TestRouterHostComponent {}

describe('contact route', () => {
  let fixture: ComponentFixture<TestRouterHostComponent>;
  let router: Router;
  let validateFlagSync: jest.Mock;

  beforeEach(async () => {
    validateFlagSync = jest.fn().mockReturnValue(false);

    await TestBed.configureTestingModule({
      imports: [TestRouterHostComponent, TranslateModule.forRoot()],
      providers: [
        provideRouter([
          {
            path: 'pl',
            component: TestRouterHostComponent,
            children: [
              {
                path: CONTACT_PAGE_ROUTE,
                component: ContactFormComponent,
                canMatch: [contactPageCanMatch],
              },
              {
                path: '**',
                component: PageNotFoundComponent,
              },
            ],
          },
        ]),
        {
          provide: FeatureFlagService,
          useValue: { validateFlagSync },
        },
        {
          provide: SeoService,
          useValue: { setPageTitleByTranslationKey: jest.fn() },
        },
        importProvidersFrom(AppTestingModule),
      ],
    })
      .overrideComponent(ContactFormComponent, { set: { template: '' } })
      .compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(TestRouterHostComponent);
  });

  async function navigate(url: string): Promise<void> {
    await fixture.ngZone.run(() => router.navigateByUrl(url));
    fixture.detectChanges();
    await fixture.whenStable();
  }

  it('should render PageNotFoundComponent on /pl/contact when the flag is disabled', async () => {
    await navigate('/pl/contact');

    expect(router.url).toBe('/pl/contact');
    expect(fixture.debugElement.query(By.directive(PageNotFoundComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(ContactFormComponent))).toBeNull();
  });

  it('should render ContactFormComponent on /pl/contact when the flag is enabled', async () => {
    validateFlagSync.mockReturnValue(true);

    await navigate('/pl/contact');

    expect(router.url).toBe('/pl/contact');
    expect(fixture.debugElement.query(By.directive(ContactFormComponent))).toBeTruthy();
    expect(fixture.debugElement.query(By.directive(PageNotFoundComponent))).toBeNull();
  });
});
