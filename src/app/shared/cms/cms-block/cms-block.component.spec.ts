import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';
import { CmsBlockComponent } from '@app/shared/cms/cms-block/cms-block.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { BehaviorSubject } from 'rxjs';

const iWidget: IWidget = {
  general: {
    margin: { unit: 'px', left: 0, top: 0, right: 0, bottom: 0 },
    padding: { unit: 'px', left: 0, top: 0, right: 0, bottom: 0 },
    backgroundColor: { r: 0, g: 0, b: 0, a: 0 },
    foregroundColor: { r: 0, g: 0, b: 0, a: 0 },
    style: '',
    textAlignment: '',
    classes: '',
  },
  type: WidgetType.BANNER,
  id: '1',
};

describe('SurveyComponent', () => {
  let component: CmsBlockComponent;
  let fixture: ComponentFixture<CmsBlockComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [CmsBlockComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NgxLocalStorageModule.forRoot(), TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(CmsBlockComponent);
    component = fixture.componentInstance;
    component.oneWidget = iWidget;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });

  it('should subscribe to widgetsSubject', async () => {
    component.widgetsSubject = new BehaviorSubject<IWidget[]>([iWidget]);
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.widgets).toEqual([iWidget]);
  });
});
