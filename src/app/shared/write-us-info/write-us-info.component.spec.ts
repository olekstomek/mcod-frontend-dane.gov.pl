import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationsService } from '@app/services/notifications.service';
import { WriteUsInfoComponent } from '@app/shared/write-us-info/write-us-info.component';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap';
import { NgxLocalStorageModule } from 'ngx-localstorage';

class BsModalServiceStub {}

describe('WriteUsInfoComponent', () => {
  let component: WriteUsInfoComponent;
  let fixture: ComponentFixture<WriteUsInfoComponent>;
  let service: BsModalService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [WriteUsInfoComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxLocalStorageModule.forRoot(),
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
      ],
      providers: [{ provide: BsModalService, useClass: BsModalServiceStub }, NotificationsService],
    });
  });

  beforeEach(() => {
    service = TestBed.inject(BsModalService);
    fixture = TestBed.createComponent(WriteUsInfoComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should open write us modal', () => {
    spyOn(component, 'openWriteUsModal');
    const link = fixture.debugElement.query(By.css('.write-us-info'));
    link.triggerEventHandler('click', null);
    expect(component.openWriteUsModal).toHaveBeenCalled();
  });
});
