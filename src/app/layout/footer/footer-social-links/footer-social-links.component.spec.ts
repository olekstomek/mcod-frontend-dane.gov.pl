import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MatDialog, MatDialogRef } from '@angular/material/dialog';
import { NoopAnimationsModule } from '@angular/platform-browser/animations';
import { TranslateModule } from '@ngx-translate/core';
import { of } from 'rxjs';

import { APP_CONFIG } from '@app/app.config';
import { LeaveDomainDialogComponent } from '@app/shared/leave-domain-dialog/leave-domain-dialog.component';
import { FooterSocialLinksComponent } from './footer-social-links.component';

describe('FooterSocialLinksComponent', () => {
  let component: FooterSocialLinksComponent;
  let fixture: ComponentFixture<FooterSocialLinksComponent>;
  let dialogMock: { open: jest.Mock };
  let dialogRefMock: Partial<MatDialogRef<LeaveDomainDialogComponent, boolean>>;
  let windowOpenSpy: jest.SpyInstance;

  beforeEach(async () => {
    dialogRefMock = { afterClosed: () => of(true) };
    dialogMock = { open: jest.fn().mockReturnValue(dialogRefMock) };

    windowOpenSpy = jest.spyOn(window, 'open').mockImplementation(() => null);

    await TestBed.configureTestingModule({
      imports: [NoopAnimationsModule, TranslateModule.forRoot(), FooterSocialLinksComponent],
      providers: [{ provide: MatDialog, useValue: dialogMock }],
    }).compileComponents();

    fixture = TestBed.createComponent(FooterSocialLinksComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    windowOpenSpy.mockRestore();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should render facebook button with aria-label', () => {
    const button = fixture.nativeElement.querySelector('button.footer-social-links__button');

    expect(button).toBeTruthy();
    expect(button.getAttribute('aria-label')).toBe('Footer.Facebook.AriaLabel');
  });

  it('should open leave-domain dialog when the button is clicked', () => {
    const button: HTMLButtonElement = fixture.nativeElement.querySelector('button.footer-social-links__button');

    button.click();

    expect(dialogMock.open).toHaveBeenCalledWith(LeaveDomainDialogComponent, {
      data: {
        titleKey: 'Footer.Facebook.Dialog.Title',
        bodyPrefixKey: 'Footer.Facebook.Dialog.BodyPrefix',
        siteLinkLabelKey: 'Footer.Facebook.Dialog.SiteLinkLabel',
        siteLinkUrl: APP_CONFIG.urls.daneGovPl,
        bodyMiddleKey: 'Footer.Facebook.Dialog.BodyMiddle',
        policyLinkLabelKey: 'Footer.Facebook.Dialog.PolicyLinkLabel',
        policyLinkUrl: APP_CONFIG.urls.metaPolicy,
        stayKey: 'Footer.Facebook.Dialog.Stay',
        proceedKey: 'Footer.Facebook.Dialog.Proceed',
        closeAriaKey: 'Footer.Facebook.Dialog.CloseAria',
      },
      panelClass: 'leave-domain-dialog-panel',
      backdropClass: 'leave-domain-dialog-backdrop',
      width: '720px',
      maxWidth: '100vw',
      maxHeight: '100vh',
      autoFocus: true,
    });
  });

  it('should open Facebook in a new tab when dialog is confirmed', () => {
    dialogRefMock.afterClosed = () => of(true);
    dialogMock.open.mockReturnValue(dialogRefMock);

    component.openFacebook();

    expect(windowOpenSpy).toHaveBeenCalledWith(APP_CONFIG.urls.facebook, '_blank', 'noopener,noreferrer');
  });

  it('should not navigate when dialog is dismissed', () => {
    dialogRefMock.afterClosed = () => of(false);
    dialogMock.open.mockReturnValue(dialogRefMock);

    component.openFacebook();

    expect(windowOpenSpy).not.toHaveBeenCalled();
  });
});
