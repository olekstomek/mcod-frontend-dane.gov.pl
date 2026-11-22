import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FavoriteButtonComponent } from './favorite-button.component';
import { TranslateModule } from '@ngx-translate/core';
import { ConfirmDialogService } from '@app/shared/confirm-dialog/confirm-dialog.service';
import { of, noop } from 'rxjs';

class MockConfirmDialogService {
  open = noop;
  confirmed() {
    return of(true);
  }
}

describe('FavoriteButtonComponent', () => {
  let component: FavoriteButtonComponent;
  let fixture: ComponentFixture<FavoriteButtonComponent>;
  let dialogService: ConfirmDialogService;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [FavoriteButtonComponent, TranslateModule.forRoot()],
      providers: [{ provide: ConfirmDialogService, useClass: MockConfirmDialogService }],
    }).compileComponents();

    fixture = TestBed.createComponent(FavoriteButtonComponent);
    component = fixture.componentInstance;
    dialogService = TestBed.inject(ConfirmDialogService);
    fixture.detectChanges();
  });

  it('should create the component', () => {
    expect(component).toBeTruthy();
  });

  it('should have default favorite state set to false', () => {
    expect(component.favorite()).toBe(false);
  });

  it('should update favorite model when setInput is called', () => {
    fixture.componentRef.setInput('favorite', true);
    fixture.detectChanges();

    expect(component.favorite()).toBe(true);
  });

  it('should emit change request without confirmation dialog when favorite is false', () => {
    const mockEvent = new Event('click');
    const requested = jest.fn();
    const dialogOpenSpy = jest.spyOn(dialogService, 'open');
    component.favoriteRequested.subscribe(requested);

    expect(component.favorite()).toBe(false);

    component.toggleFavorite(mockEvent);
    expect(dialogOpenSpy).not.toHaveBeenCalled();
    expect(requested).toHaveBeenCalledTimes(1);
  });

  it('should open dialog and emit event after confirmation when favorite is true', () => {
    fixture.componentRef.setInput('favorite', true);
    fixture.componentRef.setInput('useConfirmation', true); // <-- Włączamy potwierdzenie
    fixture.detectChanges();

    const mockEvent = new Event('click');
    const requested = jest.fn();
    const dialogOpenSpy = jest.spyOn(dialogService, 'open');
    jest.spyOn(dialogService, 'confirmed').mockReturnValue(of(true));
    component.favoriteRequested.subscribe(requested);

    component.toggleFavorite(mockEvent);

    expect(dialogOpenSpy).toHaveBeenCalled();
    expect(requested).toHaveBeenCalledTimes(1);
  });

  it('should open dialog and NOT emit event on dismissal when favorite is true', () => {
    fixture.componentRef.setInput('favorite', true);
    fixture.componentRef.setInput('useConfirmation', true); // <-- Włączamy potwierdzenie
    fixture.detectChanges();

    const mockEvent = new Event('click');
    const requested = jest.fn();
    const dialogOpenSpy = jest.spyOn(dialogService, 'open');
    jest.spyOn(dialogService, 'confirmed').mockReturnValue(of(false));
    component.favoriteRequested.subscribe(requested);

    component.toggleFavorite(mockEvent);

    expect(dialogOpenSpy).toHaveBeenCalled();
    expect(requested).not.toHaveBeenCalled();
  });

  it('should disable button and prevent emission when request is pending', () => {
    fixture.componentRef.setInput('pending', true);
    fixture.detectChanges();
    const requested = jest.fn();
    component.favoriteRequested.subscribe(requested);
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.disabled).toBe(true);
    expect(button.classList).toContain('is-pending');

    component.toggleFavorite(new Event('click'));
    expect(requested).not.toHaveBeenCalled();
  });

  it('should enable button when request is not pending', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button');

    expect(button.disabled).toBe(false);
  });

  it('should stop event propagation on toggleFavorite', () => {
    const mockEvent = new Event('click');
    const stopPropagationSpy = jest.spyOn(mockEvent, 'stopPropagation');

    component.toggleFavorite(mockEvent);

    expect(stopPropagationSpy).toHaveBeenCalled();
  });

  it('should return correct translation key based on favorite state', () => {
    expect(component['buttonLabelTranslationKey']()).toBe('Favorites.Toggle.Add');

    fixture.componentRef.setInput('favorite', true);
    fixture.detectChanges();

    expect(component['buttonLabelTranslationKey']()).toBe('Favorites.Toggle.Remove');
  });

  it('should return correct SVG fill value based on favorite state', () => {
    expect(component['svgFill']()).toBe('none');

    fixture.componentRef.setInput('favorite', true);
    fixture.detectChanges();

    expect(component['svgFill']()).toBe('currentColor');
  });
});
