import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { NewsletterService } from '@app/services/newsletter.service';
import { NotificationsService } from '@app/services/notifications.service';
import { ActiveNewsletterComponent } from '@app/user/newsletter/active-newsletter/active-newsletter.component';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { of } from 'rxjs/internal/observable/of';

describe('ActiveNewsletterComponent', () => {
  let component: ActiveNewsletterComponent;
  let fixture: ComponentFixture<ActiveNewsletterComponent>;
  let service: NewsletterService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [ActiveNewsletterComponent],
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
    fixture = TestBed.createComponent(ActiveNewsletterComponent);
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
