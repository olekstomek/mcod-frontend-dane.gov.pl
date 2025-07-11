import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { SeoService } from '@app/services/seo.service';
import { SearchSuggestRegionListboxOption } from '@app/shared/search-suggest/search-suggest';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { RegionsSearchComponent } from './regions-search.component';

class SeoServiceStub {
  setPageTitle() {}
}

describe('RegionsSearchComponent', () => {
  let component: RegionsSearchComponent;
  let fixture: ComponentFixture<RegionsSearchComponent>;
  let service: ListViewFiltersService;
  let seoService: SeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RegionsSearchComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NgxLocalStorageModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: SeoService, useClass: SeoServiceStub }, ListViewFiltersService],
    }).compileComponents();

    service = TestBed.inject(ListViewFiltersService);
    seoService = TestBed.inject(SeoService);
    fixture = TestBed.createComponent(RegionsSearchComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });

  it('should call getAllFilters function with listboxOption object', async () => {
    const listboxOption: SearchSuggestRegionListboxOption = {
      bbox: [],
      hierarchy_label: 'Polska',
      region_id: 88543,
      title: 'Polska',
      areaTranslationKey: 'Polska',
    };
    component.getAllFilters(listboxOption);
    expect(component.noResults).toEqual(false);
    expect(component.regionId).toEqual(listboxOption.region_id);
  });

  it('should call getAllFilters function with null listboxOption object', async () => {
    const listboxOption: SearchSuggestRegionListboxOption = null;
    component.getAllFilters(listboxOption);
    expect(component.noResults).toEqual(true);
    expect(component.regionId).toEqual(undefined);
  });
});
