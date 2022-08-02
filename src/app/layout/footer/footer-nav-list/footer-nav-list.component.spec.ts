import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { FooterNavListComponent } from '@app/layout/footer/footer-nav-list/footer-nav-list.component';
import { TranslateModule } from '@ngx-translate/core';

describe('FooterNavListComponent', () => {
  let component: FooterNavListComponent;
  let fixture: ComponentFixture<FooterNavListComponent>;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [FooterNavListComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot()],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterNavListComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });
});
