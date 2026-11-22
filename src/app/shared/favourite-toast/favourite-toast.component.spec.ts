import { TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { Subject } from 'rxjs';
import { FavouriteToastService } from '@app/services/favourite-intent/favourite-toast.service';
import { FavouriteToastComponent } from './favourite-toast.component';
describe('FavouriteToastComponent', () => {
  function setup() {
    TestBed.configureTestingModule({
      imports: [FavouriteToastComponent, TranslateModule.forRoot()],
      providers: [{ provide: Router, useValue: { events: new Subject() } }],
    });
    const fixture = TestBed.createComponent(FavouriteToastComponent);
    return { fixture, service: TestBed.inject(FavouriteToastService), el: fixture.nativeElement as HTMLElement };
  }
  it('renders nothing without toasts', () => {
    const { fixture, el } = setup();
    fixture.detectChanges();
    expect(el.querySelector('.favourite-toast')).toBeNull();
  });
  it('renders toast by type with alert role for errors and closes it on click', () => {
    const { fixture, service, el } = setup();
    service.show('danger', 'Favorites.Toasts.AddError');
    service.show('info', 'Favorites.Toasts.AlreadyExists');
    fixture.detectChanges();
    const toasts = el.querySelectorAll('.favourite-toast');
    expect(toasts.length).toBe(2);
    expect(toasts[0].classList).toContain('favourite-toast--danger');
    expect(toasts[0].getAttribute('role')).toBe('alert');
    expect(toasts[1].getAttribute('role')).toBe('status');
    (toasts[0].querySelector('button') as HTMLButtonElement).click();
    fixture.detectChanges();
    expect(el.querySelectorAll('.favourite-toast').length).toBe(1);
  });
});
