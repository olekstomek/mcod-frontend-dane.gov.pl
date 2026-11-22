import { Component } from '@angular/core';
import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FixedSidebarDirective } from '@app/shared/directives/fixed-sidebar.directive';

@Component({
  template: `
    <div class="parent" style="height: 1000px; position: relative; top: 100px;">
      <aside appFixedSidebar [fixedSidebarMinWindowWidth]="1000" [fixedSidebarPaddingTop]="20" style="height: 400px;">
        Sidebar Content
      </aside>
    </div>
  `,
  standalone: true,
  imports: [FixedSidebarDirective],
})
class TestHostComponent {}

describe('FixedSidebarDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let sidebarEl: HTMLElement;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent, FixedSidebarDirective],
    }).compileComponents();
  });

  afterEach(() => {
    window.innerWidth = 1024;
    window.pageYOffset = 0;
  });

  it('should create an instance via host component', () => {
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    const directiveDebugEl = fixture.debugElement.query(By.directive(FixedSidebarDirective));
    expect(directiveDebugEl).toBeTruthy();
  });

  it('should not apply fixed styles if window width is less than minWindowWidth', fakeAsync(() => {
    window.innerWidth = 800;
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    sidebarEl = fixture.debugElement.query(By.css('aside')).nativeElement;

    window.pageYOffset = 200;
    window.dispatchEvent(new Event('scroll'));
    tick(50);
    fixture.detectChanges();

    expect(sidebarEl.style.position).not.toBe('fixed');
  }));

  it('should apply fixed styles and handle scroll when pageY exceeds parent offset', fakeAsync(() => {
    window.innerWidth = 1200;
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    sidebarEl = fixture.debugElement.query(By.css('aside')).nativeElement;
    const parentEl = sidebarEl.parentElement!;

    Object.defineProperty(parentEl, 'offsetTop', { value: 100, configurable: true });
    Object.defineProperty(parentEl, 'offsetHeight', { value: 1000, configurable: true });
    Object.defineProperty(sidebarEl, 'scrollHeight', { value: 800, configurable: true });
    Object.defineProperty(sidebarEl, 'clientHeight', { value: 400, configurable: true });

    window.pageYOffset = 150;
    window.dispatchEvent(new Event('scroll'));
    tick(50);
    fixture.detectChanges();

    expect(sidebarEl.style.position).toBe('fixed');
    expect(sidebarEl.style.top).toBe('20px');
    expect(sidebarEl.style.overflowY).toBe('auto');

    const initialScrollTop = sidebarEl.scrollTop;
    window.pageYOffset = 180;
    window.dispatchEvent(new Event('scroll'));
    tick(50);
    fixture.detectChanges();

    expect(sidebarEl.scrollTop).toBeGreaterThan(initialScrollTop);
  }));

  it('should reset styles when scrolled back above parent offset', fakeAsync(() => {
    window.innerWidth = 1200;
    fixture = TestBed.createComponent(TestHostComponent);
    fixture.detectChanges();

    sidebarEl = fixture.debugElement.query(By.css('aside')).nativeElement;
    const parentEl = sidebarEl.parentElement!;

    Object.defineProperty(parentEl, 'offsetTop', { value: 100, configurable: true });
    Object.defineProperty(parentEl, 'offsetHeight', { value: 1000, configurable: true });
    Object.defineProperty(sidebarEl, 'scrollHeight', { value: 800, configurable: true });
    Object.defineProperty(sidebarEl, 'clientHeight', { value: 400, configurable: true });

    window.pageYOffset = 200;
    window.dispatchEvent(new Event('scroll'));
    tick(50);
    fixture.detectChanges();
    expect(sidebarEl.style.position).toBe('fixed');

    window.pageYOffset = 10;
    window.dispatchEvent(new Event('scroll'));
    tick(50);
    fixture.detectChanges();

    expect(sidebarEl.style.position).toBe('');
  }));
});
