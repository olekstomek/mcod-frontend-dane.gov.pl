import { inject, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';

import { ListViewFiltersService } from './list-view-filters.service';
import { ServiceTestbed } from '@app/services/tests/service.testbed';
import { HttpTestingController } from '@angular/common/http/testing';

describe('ListViewFiltersService', () => {
  let service: ListViewFiltersService;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule(ServiceTestbed.module(ListViewFiltersService));

    service = TestBed.inject(ListViewFiltersService);
    httpMock = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  it('should addTermsSuffix getOneById function', () => {
    expect(service.addTermsSuffix('regions')).toBeTruthy();
  });

  it('should call addByPrefix function', () => {
    expect(service.addByPrefix('by_regions')).toBeTruthy();
  });

  it('should call updateBasicParams function', () => {
    expect(service.updateBasicParams({}, {})).toBeTruthy();
  });

  it('should call prepareFilters function', () => {
    expect(service.prepareFilters({})).toBeTruthy();
  });

  it('should call prepareParamsBeforeUpdate function', () => {
    const params = {
      sort: 'data',
      per_page: 5,
      q: '',
      page: 1,
    };
    expect(service.prepareParamsBeforeUpdate(params)).toBeTruthy();
  });

  it('should call updateParams function', () => {
    const params = {
      sort: 'data',
      per_page: 5,
      q: '',
      page: 1,
    };
    expect(service.updateParams(params, 'merge', {}, {})).toBeFalsy();
  });

  it('should call performSearch function', () => {
    const params = {
      sort: 'data',
      per_page: 5,
      q: '',
      page: 1,
    };
    expect(service.performSearch(params, {}, {})).toBeFalsy();
  });

  it('should call setSelectedFilters function', () => {
    const params = {
      sort: 'data',
      per_page: 5,
      q: '',
      page: 1,
    };
    expect(service.setSelectedFilters(params, [], {}, {}, {})).toBeTruthy();
  });

  it('should call allBasicParamsIn function', () => {
    const params = {
      sort: 'data',
      per_page: 5,
      q: '',
      page: 1,
    };
    expect(service.allBasicParamsIn(params, {})).toBeTruthy();
  });

  it('addTermsSuffix - should return value', () => {
    const name = 'regions';
    const filterNameWithSuffix = name + '[id][terms]';
    expect(service.addTermsSuffix(name)).toEqual(filterNameWithSuffix);
  });

  it('addByPrefix - should return value', () => {
    const name = 'regions';
    const filterName = 'by_' + name;
    expect(service.addByPrefix(name)).toEqual(filterName);
  });

  it('updateBasicParams - should return value', () => {
    const params = {
      sort: 'data',
      per_page: 5,
      q: '',
      page: 1,
    };
    expect(service.updateBasicParams(params, {})).toEqual(params);
  });

  it('prepareFilters - should return value', () => {
    expect(service.prepareFilters({})).toEqual({});
  });

  it('prepareParamsBeforeUpdate - should return value', () => {
    const params = {
      sort: 'date',
      per_page: 5,
      q: '',
      page: 1,
    };
    const newParams = Object.assign({}, params);
    Object.keys(newParams).forEach((key: string) => {
      const filterNameWithSuffix = key + '[terms]';
      newParams[filterNameWithSuffix] = newParams[key];
      delete newParams[key];
    });

    expect(service.prepareParamsBeforeUpdate(params)).toEqual(newParams);
  });

  it('updateParams - should return value', inject([Router], async (router: Router) => {
    const routerNavigationSpy = spyOn(router, 'navigateByUrl').and.stub();
    const params = {
      sort: 'data',
      per_page: 5,
      q: '',
      page: 1,
    };
    service.updateParams(params, 'merge', params, params);
    expect(routerNavigationSpy).toHaveBeenCalledTimes(1);
  }));

  it('performSearch - should return value', inject([Router], async (router: Router) => {
    const routerNavigationSpy = spyOn(router, 'navigateByUrl').and.stub();
    const params = {
      sort: 'data',
      per_page: 5,
      q: 'test',
      page: 1,
    };
    service.performSearch(params, {}, {});
    expect(params.q).toEqual('test');
    expect(routerNavigationSpy).toHaveBeenCalledTimes(1);
  }));

  it('allBasicParamsIn - should return true', () => {
    const params = {
      sort: 'date',
      per_page: 5,
      q: '',
      page: 1,
    };
    expect(service.allBasicParamsIn(params, {})).toEqual(true);
  });

  it('allBasicParamsIn - should return false', () => {
    const params = {
      sort: 'date',
      per_page: 5,
      page: 1,
    };
    const basicParams = {
      sort: 'date',
      per_page: 5,
      q: '',
      page: 1,
    };
    expect(service.allBasicParamsIn(params, basicParams)).toEqual(false);
  });
});
