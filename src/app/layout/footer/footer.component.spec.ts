import { HttpClientTestingModule } from '@angular/common/http/testing';
import { EventEmitter } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { TranslateModule } from '@ngx-translate/core';
import { BsModalService } from 'ngx-bootstrap';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { of } from 'rxjs/internal/observable/of';
import { FooterComponent } from './footer.component';

import { FooterLogosFilterService } from '@app/layout/footer/footer-logos-filter.service';
import { CmsService } from '@app/services/cms.service';

describe('FooterComponent', () => {
  let component: FooterComponent;
  let fixture: ComponentFixture<FooterComponent>;
  let service: CmsService;
  const BsModalServiceMock = {
    onHidden: new EventEmitter(),
    hide: () => {},
    open: () => {},
  };

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NgxLocalStorageModule.forRoot(), TranslateModule.forRoot()],
      providers: [{ provide: BsModalService, useValue: BsModalServiceMock }, CmsService, FooterLogosFilterService],
    }).compileComponents();

    service = TestBed.inject(CmsService);
    fixture = TestBed.createComponent(FooterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    spyOn(BsModalServiceMock, 'onHidden').and.returnValue(of({}));
    spyOn(service, 'elementFooterNavIsExist').and.returnValue(of({ isElementFooterNavExist: true }));
    expect(component).toBeDefined();
  });
});
