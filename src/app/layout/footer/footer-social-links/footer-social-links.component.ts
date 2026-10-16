import { DOCUMENT } from '@angular/common';
import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import { MatDialog } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

import { APP_CONFIG } from '@app/app.config';
import {
  ILeaveDomainDialogData,
  LeaveDomainDialogComponent,
} from '@app/shared/leave-domain-dialog/leave-domain-dialog.component';

@Component({
  selector: 'app-footer-social-links',
  templateUrl: './footer-social-links.component.html',
  styleUrl: './footer-social-links.component.scss',
  standalone: true,
  imports: [TranslatePipe],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FooterSocialLinksComponent {
  private readonly dialog = inject(MatDialog);
  private readonly document = inject(DOCUMENT);

  openFacebook(): void {
    const dialogData: ILeaveDomainDialogData = {
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
    };

    const dialogRef = this.dialog.open<LeaveDomainDialogComponent, ILeaveDomainDialogData, boolean>(
      LeaveDomainDialogComponent,
      {
        data: dialogData,
        panelClass: 'leave-domain-dialog-panel',
        backdropClass: 'leave-domain-dialog-backdrop',
        width: '720px',
        maxWidth: '100vw',
        maxHeight: '100vh',
        autoFocus: true,
      },
    );

    dialogRef.afterClosed().subscribe((confirmed) => {
      if (confirmed) {
        this.document.defaultView?.open(APP_CONFIG.urls.facebook, '_blank', 'noopener,noreferrer');
      }
    });
  }
}
