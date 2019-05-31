import { TestBed, inject } from '@angular/core/testing';

import { ArticlesService } from './articles.service';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('ArticlesService', () => {
  beforeEach(() => {
      TestBed.configureTestingModule(ServiceTestbed.module(ArticlesService));
  });

  it('should be created', inject([ArticlesService], (service: ArticlesService) => {
    expect(service).toBeTruthy();
  }));
});
