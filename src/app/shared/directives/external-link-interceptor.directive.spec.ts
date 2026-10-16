import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { MatDialog } from '@angular/material/dialog';
import { of } from 'rxjs';

import { ExternalLinkInterceptorDirective } from './external-link-interceptor.directive';
import { ComponentType } from '@angular/cdk/portal';
import { ComponentFixture, TestBed } from '@angular/core/testing';

@Component({
  selector: 'app-dummy-modal',
  standalone: true,
  template: '<div>Dummy Modal</div>',
})
class DummyModalComponent {}

@Component({
  selector: 'app-test-host',
  standalone: true,
  imports: [ExternalLinkInterceptorDirective],
  template: `
    <div
      class="container"
      appExternalLinkInterceptor
      [modalComponent]="modalComponent"
      [dialogDataFactory]="dataFactory"
    >
      <a id="internal-link" href="/internal-page">Internal</a>
      <a id="external-link" href="https://external-site.com/page">External</a>
      <span id="not-a-link">Not a link</span>
    </div>
  `,
})
class TestHostComponent {
  public modalComponent: ComponentType<unknown> = DummyModalComponent;
  public dataFactory?: (href: string) => unknown = undefined;
}

describe('ExternalLinkInterceptorDirective', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let component: TestHostComponent;
  let containerDebugElement: DebugElement;
  let dialogMock: { open: jest.Mock };
  let dialogRefMock: { afterClosed: jest.Mock };
  let originalWindowOpen: typeof window.open;

  beforeEach(async () => {
    dialogRefMock = {
      afterClosed: jest.fn().mockReturnValue(of(true)),
    };

    dialogMock = {
      open: jest.fn().mockReturnValue(dialogRefMock),
    };

    originalWindowOpen = window.open;
    window.open = jest.fn();

    await TestBed.configureTestingModule({
      imports: [TestHostComponent],
      providers: [{ provide: MatDialog, useValue: dialogMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    component = fixture.componentInstance;
    containerDebugElement = fixture.debugElement.query(
      By.directive(ExternalLinkInterceptorDirective),
    );
    fixture.detectChanges();
  });

  afterEach(() => {
    window.open = originalWindowOpen;
    jest.clearAllMocks();
  });

  it('should create the host component with the directive', () => {
    expect(component).toBeTruthy();
    expect(containerDebugElement).toBeTruthy();
  });

  it('should not take any action when clicking on a non-link element', () => {
    const notALinkElement: DebugElement = containerDebugElement.query(
      By.css('#not-a-link'),
    );
    const clickEvent: MouseEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    jest.spyOn(clickEvent, 'preventDefault');

    notALinkElement.nativeElement.dispatchEvent(clickEvent);
    fixture.detectChanges();

    expect(clickEvent.preventDefault).not.toHaveBeenCalled();
    expect(dialogMock.open).not.toHaveBeenCalled();
  });

  it('should not intervene when clicking on an internal link', () => {
    const internalLinkElement: DebugElement = containerDebugElement.query(
      By.css('#internal-link'),
    );
    const clickEvent: MouseEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    jest.spyOn(clickEvent, 'preventDefault');

    internalLinkElement.nativeElement.dispatchEvent(clickEvent);
    fixture.detectChanges();

    expect(clickEvent.preventDefault).not.toHaveBeenCalled();
    expect(dialogMock.open).not.toHaveBeenCalled();
  });

  it('should open modal and redirect after confirmation for an external link', () => {
    const externalLinkElement: DebugElement = containerDebugElement.query(
      By.css('#external-link'),
    );
    const clickEvent: MouseEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    jest.spyOn(clickEvent, 'preventDefault');

    externalLinkElement.nativeElement.dispatchEvent(clickEvent);
    fixture.detectChanges();

    expect(clickEvent.preventDefault).toHaveBeenCalled();
    expect(dialogMock.open).toHaveBeenCalledWith(
      DummyModalComponent,
      expect.objectContaining({
        data: { url: 'https://external-site.com/page' },
        width: '720px',
      }),
    );
    expect(window.open).toHaveBeenCalledWith(
      'https://external-site.com/page',
      '_blank',
      'noopener,noreferrer',
    );
  });

  it('should use dialogDataFactory to generate modal data if provided', () => {
    component.dataFactory = (href: string): unknown => ({
      customKey: `custom-${href}`,
    });
    fixture.detectChanges();

    const externalLinkElement: DebugElement = containerDebugElement.query(
      By.css('#external-link'),
    );
    const clickEvent: MouseEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    externalLinkElement.nativeElement.dispatchEvent(clickEvent);
    fixture.detectChanges();

    expect(dialogMock.open).toHaveBeenCalledWith(
      DummyModalComponent,
      expect.objectContaining({
        data: { customKey: 'custom-https://external-site.com/page' },
      }),
    );
  });

  it('should not open a new tab if the user rejects the modal (confirmed = false)', () => {
    dialogRefMock.afterClosed.mockReturnValueOnce(of(false));

    const externalLinkElement: DebugElement = containerDebugElement.query(
      By.css('#external-link'),
    );
    const clickEvent: MouseEvent = new MouseEvent('click', {
      bubbles: true,
      cancelable: true,
    });

    externalLinkElement.nativeElement.dispatchEvent(clickEvent);
    fixture.detectChanges();

    expect(dialogMock.open).toHaveBeenCalled();
    expect(window.open).not.toHaveBeenCalled();
  });
});
