import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { ListViewManageFiltersService } from '@app/services/filters/list-view-manage-filters.service';
import { ListViewFilterAbstractComponent } from '@app/shared/filters/list-view-filter-abstract/list-view-filter-abstract.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { DaterangeFilterUpdated, IAggregationProperties } from '@app/services/models/filters';

describe('ListViewFilterAbstractComponent', () => {
  let component: ListViewFilterAbstractComponent;
  let fixture: ComponentFixture<ListViewFilterAbstractComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ListViewFilterAbstractComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NgxLocalStorageModule.forRoot(), TranslateModule.forRoot()],
      providers: [ListViewManageFiltersService],
    }).compileComponents();

    fixture = TestBed.createComponent(ListViewFilterAbstractComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    component.data = { categories: '' };
    expect(component).toBeDefined();
  });

  it('should updates selected filters data and availability map for multiselect filter after change has been made for categories', () => {
    const selectedOption: IAggregationProperties = {
      id: '1',
      doc_count: 3,
      title: 'test',
    };
    component.selectedData = { categories: '' };
    component.originalSelectedData = { categories: '' };
    fixture.detectChanges();
    component.onSelectedChange('categories', selectedOption);
    expect(component.availabilityFilterMap).not.toBeNull();
  });

  it('should updates selected filters data and availability map for multiselect filter after change has been made for regions', () => {
    const selectedOption: IAggregationProperties = {
      id: '1',
      doc_count: 3,
      title: 'test',
    };
    component.selectedData = { regions: '' };
    component.originalSelectedData = { regions: '' };
    fixture.detectChanges();
    component.onSelectedChange('regions', selectedOption);
    expect(component.availabilityFilterMap).not.toBeNull();
  });

  it('should updates selected filters data and availability map for daterange filter after change has been made', () => {
    const data: DaterangeFilterUpdated = {
      name: 'gte',
      value: new Date(),
    };
    component.selectedData = { 'date[gte]': '', 'date[lte]': '' };
    component.originalSelectedData = { 'date[gte]': '', 'date[lte]': '' };
    fixture.detectChanges();
    component.onDaterangeChange([data]);
    expect(component.availabilityFilterMap).not.toBeNull();
  });
});
