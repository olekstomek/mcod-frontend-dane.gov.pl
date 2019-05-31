import { TestBed, inject } from '@angular/core/testing';

import { InstitutionsService } from './institutions.service';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('InstitutionsService', () => {
  beforeEach(() => {
      TestBed.configureTestingModule(ServiceTestbed.module(InstitutionsService));
  });

  it('should be created', inject([InstitutionsService], (service: InstitutionsService) => {
    expect(service).toBeTruthy();
  }));
});
