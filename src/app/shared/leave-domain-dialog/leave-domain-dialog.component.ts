import { ChangeDetectionStrategy, Component, inject } from '@angular/core';
import {
  MAT_DIALOG_DATA,
  MatDialogActions,
  MatDialogClose,
  MatDialogContent,
  MatDialogRef,
  MatDialogTitle,
} from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

export interface ILeaveDomainDialogData {
  titleKey: string;
  bodyPrefixKey: string;
  siteLinkLabelKey: string;
  siteLinkUrl: string;
  bodyMiddleKey: string;
  policyLinkLabelKey: string;
  policyLinkUrl: string;
  stayKey: string;
  proceedKey: string;
  closeAriaKey: string;
}

@Component({
  selector: 'app-leave-domain-dialog',
  templateUrl: './leave-domain-dialog.component.html',
  styleUrl: './leave-domain-dialog.component.scss',
  standalone: true,
  imports: [TranslatePipe, MatDialogTitle, MatDialogContent, MatDialogActions, MatDialogClose],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class LeaveDomainDialogComponent {
  readonly data = inject<ILeaveDomainDialogData>(MAT_DIALOG_DATA);
  private readonly dialogRef = inject<MatDialogRef<LeaveDomainDialogComponent, boolean>>(MatDialogRef);

  stay(): void {
    this.dialogRef.close(false);
  }

  proceed(): void {
    this.dialogRef.close(true);
  }
}
