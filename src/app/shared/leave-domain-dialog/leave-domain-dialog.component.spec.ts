import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';

import { ILeaveDomainDialogData, LeaveDomainDialogComponent } from './leave-domain-dialog.component';

describe('LeaveDomainDialogComponent', () => {
  let component: LeaveDomainDialogComponent;
  let fixture: ComponentFixture<LeaveDomainDialogComponent>;
  let dialogRefMock: { close: jest.Mock };

  const data: ILeaveDomainDialogData = {
    titleKey: 'Footer.Facebook.Dialog.Title',
    bodyPrefixKey: 'Footer.Facebook.Dialog.BodyPrefix',
    siteLinkLabelKey: 'Footer.Facebook.Dialog.SiteLinkLabel',
    siteLinkUrl: 'https://www.dane.gov.pl',
    bodyMiddleKey: 'Footer.Facebook.Dialog.BodyMiddle',
    policyLinkLabelKey: 'Footer.Facebook.Dialog.PolicyLinkLabel',
    policyLinkUrl: 'https://www.facebook.com/privacy/policy',
    stayKey: 'Footer.Facebook.Dialog.Stay',
    proceedKey: 'Footer.Facebook.Dialog.Proceed',
    closeAriaKey: 'Footer.Facebook.Dialog.CloseAria',
  };

  beforeEach(async () => {
    dialogRefMock = { close: jest.fn() };

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TranslateModule.forRoot(), LeaveDomainDialogComponent],
      providers: [
        { provide: MAT_DIALOG_DATA, useValue: data },
        { provide: MatDialogRef, useValue: dialogRefMock },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LeaveDomainDialogComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should render title, body and both links', () => {
    const host: HTMLElement = fixture.nativeElement;
    const title = host.querySelector('.leave-domain-dialog__title');
    const body = host.querySelector('.leave-domain-dialog__body');
    const links = host.querySelectorAll<HTMLAnchorElement>('.leave-domain-dialog__link');
    const policyLink = host.querySelector<HTMLAnchorElement>('.leave-domain-dialog__policy-link');

    expect(title?.textContent).toContain(data.titleKey);
    expect(body?.textContent).toContain(data.bodyPrefixKey);
    expect(body?.textContent).toContain(data.bodyMiddleKey);
    expect(links.length).toBe(2);
    expect(links[0].getAttribute('href')).toBe(data.siteLinkUrl);
    expect(links[0].getAttribute('target')).toBe('_blank');
    expect(links[0].getAttribute('rel')).toBe('noopener noreferrer');
    expect(policyLink?.getAttribute('href')).toBe(data.policyLinkUrl);
    expect(policyLink?.getAttribute('target')).toBe('_blank');
    expect(policyLink?.getAttribute('rel')).toBe('noopener noreferrer');
  });

  it('should close with true when proceed is clicked', () => {
    component.proceed();

    expect(dialogRefMock.close).toHaveBeenCalledWith(true);
  });

  it('should close with false when stay is clicked', () => {
    component.stay();

    expect(dialogRefMock.close).toHaveBeenCalledWith(false);
  });
});
