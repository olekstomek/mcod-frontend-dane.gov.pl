import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoriteDatasetsTileComponent } from './favorite-datasets-tile.component';
import { TranslateModule } from '@ngx-translate/core';
import { LocalizeRouterModule } from '@gilsdav/ngx-translate-router';
import { provideRouter } from '@angular/router';

describe('FavoriteDatasetsTileComponent', () => {
  let component: FavoriteDatasetsTileComponent;
  let fixture: ComponentFixture<FavoriteDatasetsTileComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteDatasetsTileComponent, TranslateModule.forRoot(), LocalizeRouterModule.forRoot([])],
      providers: [provideRouter([])],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoriteDatasetsTileComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default datasetsCount set to 0', () => {
    expect(component.datasetsCount()).toBe(0);
  });

  it('should update datasetsCount when setInput is called', () => {
    fixture.componentRef.setInput('datasetsCount', 5);
    fixture.detectChanges();

    expect(component.datasetsCount()).toBe(5);
  });

  it('should render datasetsCount in the DOM', () => {
    fixture.componentRef.setInput('datasetsCount', 12);
    fixture.detectChanges();

    const countElement: HTMLElement = fixture.nativeElement.querySelector('.font-weight-bold.h4');
    expect(countElement.textContent?.trim()).toBe('12');
  });

  it('should render the see details router link', () => {
    const linkElement: HTMLAnchorElement = fixture.nativeElement.querySelector('a.btn-primary');
    expect(linkElement).toBeTruthy();
  });
});
