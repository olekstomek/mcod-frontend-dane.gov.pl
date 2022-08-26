import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, convertToParamMap } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { DatasetService } from '@app/services/dataset.service';
import { NotificationsService } from '@app/services/notifications.service';
import { SeoService } from '@app/services/seo.service';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { of } from 'rxjs/internal/observable/of';
import { EmbeddedComponent } from './embedded.component';

class SeoServiceStub {
  setPageTitle() {}
}

describe('EmbeddedComponent', () => {
  let component: EmbeddedComponent;
  let fixture: ComponentFixture<EmbeddedComponent>;
  let service: DatasetService;
  let seoService: SeoService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [EmbeddedComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NgxLocalStorageModule.forRoot(), TranslateModule.forRoot()],
      providers: [
        { provide: SeoService, useClass: SeoServiceStub },
        DatasetService,
        NotificationsService,
        {
          provide: ActivatedRoute,
          useValue: { snapshot: { paramMap: convertToParamMap({ resourceId: '1' }), queryParamMap: convertToParamMap({ lang: 'pl' }) } },
        },
      ],
    }).compileComponents();

    service = TestBed.inject(DatasetService);
    seoService = TestBed.inject(SeoService);
    fixture = TestBed.createComponent(EmbeddedComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });

  it('should get params from route', async () => {
    spyOn(service, 'getResourceById').and.returnValue(
      of({ attributes: { title: 'test' }, relationships: { geo_data: false, chart: false } }),
    );
    component.ngOnInit();
    expect(component.resourceId).toEqual('1');
    expect(component.hasGeoData).toBeFalsy();
    expect(component.hasChart).toBeFalsy();
  });

  it('should get params from route without relationships', async () => {
    spyOn(service, 'getResourceById').and.returnValue(of({ attributes: { title: 'test' } }));
    component.ngOnInit();
    expect(component.resourceId).toEqual('1');
  });
});
