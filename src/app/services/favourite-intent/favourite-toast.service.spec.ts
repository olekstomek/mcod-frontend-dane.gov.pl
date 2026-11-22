import { TestBed } from '@angular/core/testing';
import { NavigationStart, Router } from '@angular/router';
import { Subject } from 'rxjs';
import { FavouriteToastService } from './favourite-toast.service';
describe('FavouriteToastService', () => {
  const events = new Subject<unknown>();
  let service: FavouriteToastService;
  beforeEach(() => {
    TestBed.configureTestingModule({ providers: [{ provide: Router, useValue: { events } }] });
    service = TestBed.inject(FavouriteToastService);
  });
  it('adds toasts and does not duplicate the same message', () => {
    service.show('danger', 'Favorites.Toasts.AddError');
    service.show('danger', 'Favorites.Toasts.AddError');
    service.show('info', 'Favorites.Toasts.AlreadyExists');
    expect(service.toasts().map((toast) => toast.messageKey)).toEqual([
      'Favorites.Toasts.AddError',
      'Favorites.Toasts.AlreadyExists',
    ]);
  });
  it('dismisses a single toast', () => {
    service.show('danger', 'a');
    service.show('success', 'b');
    service.dismiss(service.toasts()[0].id);
    expect(service.toasts().map((toast) => toast.messageKey)).toEqual(['b']);
  });
  it('clears toasts on navigation start', () => {
    service.show('danger', 'a');
    events.next(new NavigationStart(1, '/pl/dataset'));
    expect(service.toasts()).toEqual([]);
  });
});
