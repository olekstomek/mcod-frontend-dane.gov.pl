import { TestBed } from '@angular/core/testing';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

import { UserDashboardListViewService } from './user-dashboard-list-view.service';

describe('UserDashboardListViewService', () => {
  let service: UserDashboardListViewService;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(UserDashboardListViewService));

    service = TestBed.inject(UserDashboardListViewService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should call getAll function', () => {
    const params = {
      sort: 'relevance',
      per_page: 5,
      q: '',
      page: 1,
    };
    expect(service.getAll(params)).toBeTruthy();
  });

  it('should call getOne function', () => {
    expect(service.getOne('1')).toBeTruthy();
  });

  it('should getAll function return value', () => {
    const params = {
      sort: 'relevance',
      per_page: 5,
      q: '',
      page: 1,
    };
    service.getAll(params).subscribe(value => {
      expect(value).toBeGreaterThan(0);
    });
  });

  it('should getOne function return value', () => {
    service.getOne('1').subscribe(value => {
      expect(value).toBeGreaterThan(0);
    });
  });
});
