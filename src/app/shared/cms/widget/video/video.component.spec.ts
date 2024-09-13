import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { CmsService } from '@app/services/cms.service';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';
import { VideoComponent } from '@app/shared/cms/widget/video/video.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { IVideo, IVideoHyperEditor } from '@app/services/models/cms/widgets/video';

const videoHyperEditor: IVideoHyperEditor = {
  general: {
    margin: { unit: 'px', left: 0, top: 0, right: 0, bottom: 0 },
    padding: { unit: 'px', left: 0, top: 0, right: 0, bottom: 0 },
    backgroundColor: { r: 0, g: 0, b: 0, a: 0 },
    foregroundColor: { r: 0, g: 0, b: 0, a: 0 },
    style: '',
    textAlignment: '',
    classes: '',
  },
  type: WidgetType.VIDEO,
  id: '1',
  settings: {
    video_url: 'https://www.youtube.com/embed/',
  },
};

const video: IVideo = {
  general: {
    margin: { unit: 'px', left: 0, top: 0, right: 0, bottom: 0 },
    padding: { unit: 'px', left: 0, top: 0, right: 0, bottom: 0 },
    backgroundColor: { r: 0, g: 0, b: 0, a: 0 },
    foregroundColor: { r: 0, g: 0, b: 0, a: 0 },
    style: '',
    textAlignment: '',
    classes: '',
  },
  type: WidgetType.VIDEO,
  id: '1',
  value: {
    caption: '',
    video: '',
    uploaded_video: {
      tilte: '',
      download_url: '',
      thumbnail_url: '',
    },
  },
};

describe('VideoComponent', () => {
  let component: VideoComponent;
  let fixture: ComponentFixture<VideoComponent>;
  let service: CmsService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [VideoComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NgxLocalStorageModule.forRoot(), TranslateModule.forRoot()],
      providers: [CmsService],
    }).compileComponents();

    service = TestBed.inject(CmsService);
    fixture = TestBed.createComponent(VideoComponent);
    component = fixture.componentInstance;
    component.video = video;
  });

  it('should create', async () => {
    fixture.detectChanges();
    expect(component).toBeDefined();
  });

  /*it('should display video from cms', async () => {
    component.video = video;
    fixture.detectChanges();
    component.ngOnInit();
    expect(component.video).toEqual(video);
    expect(component.videoClass).toEqual('video-center');
  });*/
});
