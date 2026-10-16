import { importProvidersFrom } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { of } from 'rxjs';

import { AppTestingModule } from '@app/app.testing.module';
import { CmsService } from '@app/services/cms.service';
import { CmsLandingPageComponent } from './cms-landing-page.component';

describe('CmsLandingPageComponent', () => {
  let component: CmsLandingPageComponent;
  let fixture: ComponentFixture<CmsLandingPageComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [CmsLandingPageComponent],
      providers: [
        importProvidersFrom(AppTestingModule),
        {
          provide: CmsService,
          useValue: {
            getLandingPage: jest.fn().mockReturnValue(of({ body: [] })),
            displayCmsErrorMessage: jest.fn(),
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(CmsLandingPageComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should default context to "page"', () => {
    expect(component.context).toBe('page');
  });
});
