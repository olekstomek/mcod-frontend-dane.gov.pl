import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { DateRangePickerComponent } from '@app/shared/date-range-picker/date-range-picker.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';

describe('DateRangePickerComponent', () => {
  let component: DateRangePickerComponent;
  let fixture: ComponentFixture<DateRangePickerComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DateRangePickerComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NgxLocalStorageModule.forRoot(), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(DateRangePickerComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should check if start date input is exist', () => {
    spyOn(component.datesChanged, 'next');
    component.onDateChange(null);
    expect(component.datesChanged.next).not.toHaveBeenCalled();
  });

  it('should check if dates changed with is start date', () => {
    const date = new Date('2022-06-20');
    spyOn(component.datesChanged, 'next');
    component.onDateChange(date);
    expect(component.datesChanged.next).toHaveBeenCalled();
  });

  it('should check if dates changed with no start date', () => {
    const date = new Date('2022-06-20');
    spyOn(component.datesChanged, 'next');
    component.onDateChange(date, false);
    expect(component.datesChanged.next).toHaveBeenCalled();
  });

  it('should check if dates changed with null date and no start date', () => {
    component.endDate = new Date();
    fixture.detectChanges();
    spyOn(component.datesChanged, 'next');
    component.onDateChange(null, false);
    expect(component.datesChanged.next).toHaveBeenCalled();
  });

  it('should check if dates changed with isStartDate is false and global startDate is not null', () => {
    component.startDate = new Date();
    fixture.detectChanges();
    spyOn(component.datesChanged, 'next');
    component.onDateChange(null, false);
    expect(component.datesChanged.next).toHaveBeenCalled();
  });

  it('should check if dates changed when global startDate is after end data', () => {
    const date = new Date('2022-06-20');
    component.startDate = new Date();
    fixture.detectChanges();
    spyOn(component.datesChanged, 'next');
    component.onDateChange(date, false);
    expect(component.datesChanged.next).toHaveBeenCalled();
  });

  it('should check sends apply filter change', () => {
    spyOn(component.applyFilterChanged, 'emit');
    component.onApplyFilter();
    expect(component.applyFilterChanged.emit).toHaveBeenCalled();
  });
});
