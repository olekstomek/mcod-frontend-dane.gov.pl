import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { MapParamsToTranslationKeysService } from '@app/services/map-params-to-translation-keys.service';
import { DefaultResultItemComponent } from '@app/shared/result-list/result-item/default-result-item/default-result-item.component';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { Params } from '@angular/router';

describe('DefaultResultItemComponent ', () => {
  let component: DefaultResultItemComponent;
  let fixture: ComponentFixture<DefaultResultItemComponent>;
  let service: MapParamsToTranslationKeysService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DefaultResultItemComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxLocalStorageModule.forRoot(),
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
      ],
      providers: [MapParamsToTranslationKeysService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(MapParamsToTranslationKeysService);
    fixture = TestBed.createComponent(DefaultResultItemComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should set appliedFiltersNames based on params', () => {
    const params: Params = {
      'category[id][terms]': 'Attribute.CategoryLong',
      'institution[id][terms]': 'Attribute.InstitutionLong',
      'format[terms]': 'Attribute.FormatLong',
      'openness_score[terms]': 'Attribute.OpennessScore',
    };
    component.queryParams = params;
    component.ngOnInit();
    expect(component.appliedFiltersNames).toEqual([
      'Attribute.CategoryLong',
      'Attribute.InstitutionLong',
      'Attribute.FormatLong',
      'Attribute.OpennessScore',
    ]);
  });
});
