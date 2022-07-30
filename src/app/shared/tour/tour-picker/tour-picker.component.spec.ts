import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Renderer2, Type } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { TourPickerComponent } from '@app/shared/tour/tour-picker/tour-picker.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';

describe('TourPickerComponent', () => {
  let component: TourPickerComponent;
  let fixture: ComponentFixture<TourPickerComponent>;
  let renderer2: Renderer2;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [TourPickerComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NgxLocalStorageModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        Renderer2,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { queryParamMap: convertToParamMap({ tourPicker: 'picker' }) } },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(TourPickerComponent);
    component = fixture.componentInstance;
    renderer2 = fixture.componentRef.injector.get<Renderer2>(Renderer2 as Type<Renderer2>);
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should toggles finder mode', () => {
    component.toggleFinderMode();
    expect(component.isInFinderMode).toEqual(true);
  });

  it('should toggles finder mode', () => {
    component.isInFinderMode = true;
    component.toggleFinderMode();
    expect(component.isInFinderMode).toEqual(false);
  });

  it('should hides picker', () => {
    spyOn(renderer2, 'removeStyle');
    component.hidePicker();
    expect(component.isPickerVisible).toEqual(false);
    expect(renderer2.removeStyle).toHaveBeenCalled();
  });
});
