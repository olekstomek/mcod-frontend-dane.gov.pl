import { TestBed } from '@angular/core/testing';
import { Route } from '@angular/router';

import {
  contactPageCanMatch,
  NEW_CONTACT_PAGE_FLAG,
} from '@app/shared/forms/form-pages/contact-form/contact-page.config';
import { FeatureFlagService } from '@app/services/feature-flag.service';

describe('contactPageCanMatch', () => {
  let validateFlagSync: jest.Mock;

  beforeEach(() => {
    validateFlagSync = jest.fn();

    TestBed.configureTestingModule({
      providers: [
        {
          provide: FeatureFlagService,
          useValue: {
            validateFlagSync,
          },
        },
      ],
    });
  });

  it('should return true when the new contact page flag is enabled', () => {
    validateFlagSync.mockReturnValue(true);

    const result = TestBed.runInInjectionContext(() => contactPageCanMatch({} as Route, []));

    expect(result).toBe(true);
    expect(validateFlagSync).toHaveBeenCalledWith(NEW_CONTACT_PAGE_FLAG);
  });

  it('should return false when the new contact page flag is disabled', () => {
    validateFlagSync.mockReturnValue(false);

    const result = TestBed.runInInjectionContext(() => contactPageCanMatch({} as Route, []));

    expect(result).toBe(false);
    expect(validateFlagSync).toHaveBeenCalledWith(NEW_CONTACT_PAGE_FLAG);
  });
});
