import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { RouterTestingModule } from '@angular/router/testing';
import { CmsService } from '@app/services/cms.service';
import { IMetadataPageCms } from '@app/services/models/cms/metadata-page-cms';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { RodoModalComponent } from '@app/shared/rodo-modal/rodo-modal.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { of } from 'rxjs/internal/observable/of';

describe('RodoModalComponent', () => {
  let component: RodoModalComponent;
  let fixture: ComponentFixture<RodoModalComponent>;
  let service: CmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [RodoModalComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxLocalStorageModule.forRoot(),
        TranslateModule.forRoot(),
        NoopAnimationsModule,
      ],
      providers: [CmsService],
    }).compileComponents();

    service = TestBed.inject(CmsService);
    fixture = TestBed.createComponent(RodoModalComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should create modal', () => {
    const spyFunction = spyOn(service, 'getSimplePage').and.returnValue(
      of({
        id: 1,
        meta: {},
        title: 'test',
        url_path: '',
        last_published_at: '',
        latest_revision_created_at: '',
        background_image: '',
        background_color: '',
        background_paralax: false,
        body: {
          blocks: [],
        },
      }),
    );
    component.ngOnInit();
    expect(spyFunction).toHaveBeenCalled();
    expect(component.pageTitle).toEqual('test');
  });

  it('should close modal', () => {
    spyOn(component.isModalClosed, 'emit');
    component.closeModal();
    expect(component.isModalClosed.emit).toHaveBeenCalled();
  });
});
