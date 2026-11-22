import { Component, Inject } from '@angular/core';
import { MatDialogActions, MatDialogContent, MatDialogRef, MAT_DIALOG_DATA } from '@angular/material/dialog';
import { TranslatePipe } from '@ngx-translate/core';

export interface ConfirmDialogData {
  cancelText: string;
  confirmText: string;
  message: string;
  title: string;
}

@Component({
  selector: 'app-confirm-dialog',
  templateUrl: './confirm-dialog.component.html',
  styleUrl: './confirm-dialog.component.scss',
  standalone: true,
  imports: [MatDialogContent, MatDialogActions, TranslatePipe],
})
export class ConfirmDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA)
    public data: ConfirmDialogData,
    private dialogRef: MatDialogRef<ConfirmDialogComponent>,
  ) {}

  public cancel() {
    this.close(false);
  }
  public close(value: boolean) {
    this.dialogRef.close(value);
  }
  public confirm() {
    this.close(true);
  }
}
