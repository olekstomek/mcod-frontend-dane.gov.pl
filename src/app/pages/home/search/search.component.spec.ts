import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule, NgForm, ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { SearchComponent } from '@app/pages/home/search/search.component';
import { TranslateModule } from '@ngx-translate/core';

describe('SearchComponent', () => {
  let component: SearchComponent;
  let fixture: ComponentFixture<SearchComponent>;
  let router: Router;
  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [SearchComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, TranslateModule.forRoot(), ReactiveFormsModule, FormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(SearchComponent);
    router = TestBed.inject(Router);
    component = fixture.componentInstance;
    component.maxLength = 1000;
    fixture.detectChanges();
  });

  it('should be created', () => {
    expect(component).toBeTruthy();
  });

  it('should redirects to dataset lists page to display results', () => {
    const testForm = <NgForm>{
      value: {
        name: 'Hello',
        category: 'World',
      },
    };
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.search(testForm);
    expect(navigateSpy).toHaveBeenCalledWith(['/dataset']);
  });

  it('should redirects to dataset lists page to display query results', () => {
    const testForm = <NgForm>{
      value: {
        name: 'Hello',
        category: 'World',
        query: 'test',
      },
    };
    const navigateSpy = jest.spyOn(router, 'navigate');
    component.search(testForm);
    expect(navigateSpy).toHaveBeenCalledWith(['/dataset'], { queryParams: { q: 'test' } });
    expect(component.maxLength).toEqual(1000);
  });
});
