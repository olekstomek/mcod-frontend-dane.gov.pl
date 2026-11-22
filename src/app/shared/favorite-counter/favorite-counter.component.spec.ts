import { ComponentFixture, TestBed } from '@angular/core/testing';
import {
  FavoriteCounterComponent,
  getPolishPluralSuffix,
} from './favorite-counter.component';
import { TranslateService } from '@ngx-translate/core';

describe('getPolishPluralSuffix', () => {
  it('should return "Zero" when count is 0', () => {
    expect(getPolishPluralSuffix(0)).toBe('Zero');
  });

  it('should return "One" when count is 1', () => {
    expect(getPolishPluralSuffix(1)).toBe('One');
  });

  it.each([2, 3, 4, 22, 23, 24, 102, 103, 104])(
    'should return "Few" when count is %i',
    (count: number) => {
      expect(getPolishPluralSuffix(count)).toBe('Few');
    },
  );

  it.each([5, 10, 12, 13, 14, 20, 25, 112, 113, 114])(
    'should return "Many" when count is %i',
    (count: number) => {
      expect(getPolishPluralSuffix(count)).toBe('Many');
    },
  );
});

describe('FavoriteCounterComponent', () => {
  let component: FavoriteCounterComponent;
  let fixture: ComponentFixture<FavoriteCounterComponent>;
  let translateServiceMock: { instant: jest.Mock };

  beforeEach(async () => {
    translateServiceMock = {
      instant: jest.fn().mockImplementation((key: string) => {
        const translations: Record<string, string> = {
          'Favorites.Counter.Zero': 'Brak polubień',
          'Favorites.Counter.One': 'osoba dodała do ulubionych',
          'Favorites.Counter.Few': 'osoby dodały do ulubionych',
          'Favorites.Counter.Many': 'osób dodało do ulubionych',
        };
        return translations[key] || key;
      }),
    };

    await TestBed.configureTestingModule({
      imports: [FavoriteCounterComponent],
      providers: [
        { provide: TranslateService, useValue: translateServiceMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoriteCounterComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should display zero favorites text without numbers when count is 0', () => {
    fixture.componentRef.setInput('favoritesCount', 0);
    fixture.detectChanges();

    expect(component.counterText()).toBe('Brak polubień');
    expect(translateServiceMock.instant).toHaveBeenCalledWith(
      'Favorites.Counter.Zero',
    );
  });

  it('should format text correctly for 1 favorite (One)', () => {
    fixture.componentRef.setInput('favoritesCount', 1);
    fixture.detectChanges();

    expect(component.counterText()).toBe('1 osoba dodała do ulubionych');
    expect(translateServiceMock.instant).toHaveBeenCalledWith(
      'Favorites.Counter.One',
    );
  });

  it('should format text correctly for few favorites (Few)', () => {
    fixture.componentRef.setInput('favoritesCount', 2);
    fixture.detectChanges();

    expect(component.counterText()).toBe('2 osoby dodały do ulubionych');
    expect(translateServiceMock.instant).toHaveBeenCalledWith(
      'Favorites.Counter.Few',
    );
  });

  it('should format text correctly for many favorites (Many)', () => {
    fixture.componentRef.setInput('favoritesCount', 5);
    fixture.detectChanges();

    expect(component.counterText()).toBe('5 osób dodało do ulubionych');
    expect(translateServiceMock.instant).toHaveBeenCalledWith(
      'Favorites.Counter.Many',
    );
  });
});
