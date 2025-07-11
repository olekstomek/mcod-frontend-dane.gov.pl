import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { ExpandableMultiselectComponent } from '@app/shared/expandable-multiselect/expandable-multiselect.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { IAggregationProperties } from '@app/services/models/filters';

describe('ExpandableMultiselectComponent', () => {
  let component: ExpandableMultiselectComponent;
  let fixture: ComponentFixture<ExpandableMultiselectComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ExpandableMultiselectComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxLocalStorageModule.forRoot(),
        TranslateModule.forRoot(),
        NoopAnimationsModule,
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ExpandableMultiselectComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should check sends new selected option', () => {
    const option: IAggregationProperties = {
      id: '1',
      doc_count: 3,
      title: 'test',
    };
    spyOn(component.selectedChange, 'emit');
    component.selectItem(option);
    expect(component.selectedChange.emit).toHaveBeenCalled();
  });

  it('should check input value has changed', () => {
    const value = 'Test';
    component.searchChanged(value);
    expect(component.isExpanded).toEqual(true);
    expect(component.showSearchInput).toEqual(true);
  });

  it('should check input value has changed and show search input is false', () => {
    const value = 'Test';
    component.showSearchInput = false;
    fixture.detectChanges();
    component.searchChanged(value);
    expect(component.isExpanded).toEqual(true);
    expect(component.showSearchInput).toEqual(false);
  });

  it('should check input value has no changed', () => {
    const value = 'Test';
    component.totalOptions = null;
    fixture.detectChanges();
    component.searchChanged(value);
    expect(component.isExpanded).toEqual(false);
    expect(component.showSearchInput).toEqual(true);
  });

  it('should check sends apply events', () => {
    spyOn(component.applyFilter, 'emit');
    component.triggerApply();
    expect(component.applyFilter.emit).toHaveBeenCalled();
  });
});
