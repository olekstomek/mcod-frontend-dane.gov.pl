import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { FixedSidebarDirective } from '@app/shared/directives/fixed-sidebar.directive';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';

@Component({
  template: `<aside class="collapsible-sidebar-view__sidebar" id="sidebar" appFixedSidebar></aside>`,
})
class TestComponent {}

describe('FixedSidebarDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputElem: DebugElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [FixedSidebarDirective, TestComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NgxLocalStorageModule.forRoot(), TranslateModule.forRoot()],
    }).createComponent(TestComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
    inputElem = fixture.debugElement.query(By.css('#sidebar'));
  });

  it('should create', () => {
    expect(inputElem).toBeTruthy();
  });
});
