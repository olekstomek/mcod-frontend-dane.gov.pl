import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ActivatedRoute, Data, Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PreviewCmsComponent } from '@app/pages/preview-cms/preview-cms.component';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';

class ActivatedRouteSnapshotStub {
  data: Data;
  queryParams: {};
}

class ActivatedRouteStub {
  snapshot: ActivatedRouteSnapshotStub = {
    data: {
      post: {
        data: {
          attributes: {
            title: 'Lorem ipsum title',
            notes: 'Lorem ipsum notes',
          },
        },
      },
    },
    queryParams: {
      q: 'test',
    },
  };
}

describe('PreviewCmsComponent', () => {
  let component: PreviewCmsComponent;
  let fixture: ComponentFixture<PreviewCmsComponent>;
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [PreviewCmsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
      providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub }],
    }).compileComponents();

    router = TestBed.inject(Router);
    fixture = TestBed.createComponent(PreviewCmsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should get slug and query params from route. Display content only for admin', async () => {
    component.ngOnInit();
    expect(component.queryParams).toEqual({ q: 'test' });
  });
});
