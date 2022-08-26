import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { InstitutionItemResultsComponent } from '@app/pages/institutions/institution-item-results/institution-item-results.component';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';

describe('InstitutionItemResultsComponent', () => {
  let component: InstitutionItemResultsComponent;
  let fixture: ComponentFixture<InstitutionItemResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [InstitutionItemResultsComponent],
      imports: [
        HttpClientTestingModule,
        RouterTestingModule,
        NgxLocalStorageModule.forRoot(),
        TranslateModule.forRoot(),
        LocalizeRouterModule.forRoot([]),
      ],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(InstitutionItemResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
