import { HttpClientTestingModule } from '@angular/common/http/testing';
import { Component, DebugElement } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { NotificationsService } from '@app/services/notifications.service';
import { SearchService } from '@app/services/search.service';
import { DatasetAutocompleteDirective } from '@app/shared/directives/dataset-autocomplete.directive';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';

@Component({
  template: `<input type="text" app-dataset-autocomplete />`,
})
class TestComponent {}

describe('DatasetAutocompleteDirective', () => {
  let component: TestComponent;
  let fixture: ComponentFixture<TestComponent>;
  let inputElem: DebugElement;

  beforeEach(() => {
    fixture = TestBed.configureTestingModule({
      declarations: [DatasetAutocompleteDirective, TestComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NgxLocalStorageModule.forRoot(), TranslateModule.forRoot()],
      providers: [SearchService, NotificationsService],
    }).createComponent(TestComponent);

    component = fixture.componentInstance;
    fixture.detectChanges();
    inputElem = fixture.debugElement.query(By.css('input'));
  });

  it('should create', () => {
    expect(inputElem).toBeTruthy();
  });

  it('should remove dropdown after document click', () => {
    const event = new Event('click');
    document.dispatchEvent(event);
    const drop = fixture.debugElement.queryAll(By.css('.dropdown-menu'));
    expect(drop).toStrictEqual([]);
  });

  it('should test', () => {
    const event = new KeyboardEvent('keydown', { key: 'Backspace' });
    document.dispatchEvent(event);
    const drop = fixture.debugElement.queryAll(By.css('.dropdown-menu'));
    expect(drop).toStrictEqual([]);
  });
});
