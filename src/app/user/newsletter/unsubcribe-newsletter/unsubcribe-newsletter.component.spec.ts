import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NewsletterService } from '@app/services/newsletter.service';
import { NotificationsService } from '@app/services/notifications.service';
import { UnsubcribeNewsletterComponent } from '@app/user/newsletter/unsubcribe-newsletter/unsubcribe-newsletter.component';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { of } from 'rxjs/internal/observable/of';

describe('UnsubcribeNewsletterComponent', () => {
  let component: UnsubcribeNewsletterComponent;
  let fixture: ComponentFixture<UnsubcribeNewsletterComponent>;
  let service: NewsletterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [UnsubcribeNewsletterComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxLocalStorageModule.forRoot(),
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
      ],
      providers: [NewsletterService, NotificationsService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(NewsletterService);
    fixture = TestBed.createComponent(UnsubcribeNewsletterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should unsubscribe when component is destroyed', async () => {
    component['subscription'] = of().subscribe();
    const unsubscriptionSpy = jest.spyOn(component['subscription'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscriptionSpy).toHaveBeenCalled();
  });
});
