import { Component, ChangeDetectionStrategy } from '@angular/core';
import { TranslatePipe } from '@ngx-translate/core';

@Component({
  selector: 'app-form-sent-info',
  standalone: true,
  imports: [TranslatePipe],
  templateUrl: './form-sent-info.component.html',
  styleUrl: './form-sent-info.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FormSentInfoComponent {}
