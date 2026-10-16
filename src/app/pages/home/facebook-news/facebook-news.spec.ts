import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BehaviorSubject } from 'rxjs';
import { FacebookNewsComponent } from './facebook-news.component';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';
import { IWidget } from '@app/services/models/cms/widgets/widget';

describe('FacebookNewsComponent', () => {
  let component: FacebookNewsComponent;
  let fixture: ComponentFixture<FacebookNewsComponent>;

  const mockWidgets: IWidget[] = [
    {
      type: WidgetType.BANNER,
      value: {
        image: {
          title: 'facebook-widget.png',
          alt: 'facebook',
          width: 295,
          height: 345,
          download_url:
            'https://cms.dev.dane.gov.pl/media/original_images/facebook-widget.png',
        },
        action_url: 'https://www.facebook.com/danegovpl',
        target: '_blank',
      },
      id: '20a68184-e495-4432-b904-18449c033663',
      general: null,
    },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FacebookNewsComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FacebookNewsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default BehaviorSubject with null value', () => {
    expect(component.facebookWidget).toBeInstanceOf(BehaviorSubject);
    expect(component.facebookWidget.getValue()).toBeNull();
  });

  it('should receive new data emitted by facebookWidget', (done) => {
    component.facebookWidget.subscribe((widgets) => {
      if (widgets && widgets.length > 0) {
        expect(widgets).toEqual(mockWidgets);
        expect(widgets.length).toBe(1);
        done();
      }
    });

    component.facebookWidget.next(mockWidgets);
  });

  it('should update the view when facebookWidget emits new data', () => {
    component.facebookWidget = new BehaviorSubject<IWidget[]>(mockWidgets);
    fixture.detectChanges();
    const compiled = fixture.nativeElement as HTMLElement;
    const cmsBlock = compiled.querySelector('cms-block2');
    expect(cmsBlock).toBeTruthy();
  });

  it('should handle empty widgets array correctly', () => {
    component.facebookWidget.next([]);
    fixture.detectChanges();
    expect(component.facebookWidget.getValue()).toEqual([]);
  });
});
