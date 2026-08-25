import { inject } from '@angular/core';
import { CanMatchFn } from '@angular/router';
import { FeatureFlagService } from '@app/services/feature-flag.service';

export const NEW_CONTACT_PAGE_FLAG = 'S71_new_contact_page.fe';
export const CONTACT_PAGE_ROUTE = 'contact';
export const CONTACT_PAGE_LOCALIZED_ROUTE = '/!contact';

export function isNewContactPageEnabled(featureFlagService: FeatureFlagService): boolean {
  return featureFlagService.validateFlagSync(NEW_CONTACT_PAGE_FLAG);
}

export const contactPageCanMatch: CanMatchFn = () => isNewContactPageEnabled(inject(FeatureFlagService));
