import {
  Component,
  inject,
  OnDestroy,
  OnInit,
  ChangeDetectionStrategy,
  input,
  booleanAttribute,
  effect,
} from '@angular/core';
import {
  ControlContainer,
  FormControl,
  FormGroup,
  FormGroupDirective,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { standardInputLength, emailInputLength } from '@app/shared/forms/form-variables';
import { TranslatePipe } from '@ngx-translate/core';
import { NameEmailForm } from '@app/shared/forms/form-parts/name-email-form-part/name-email-models';

@Component({
  selector: 'app-name-email-form-part',
  standalone: true,
  imports: [ReactiveFormsModule, TranslatePipe],
  templateUrl: './name-email-form-part.component.html',
  viewProviders: [{ provide: ControlContainer, useExisting: FormGroupDirective }],
  styleUrl: '../../forms.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class NameEmailFormPartComponent implements OnInit, OnDestroy {
  private readonly parentFormDirective = inject(FormGroupDirective);

  readonly requiredEmail = input(false, { transform: booleanAttribute });
  hideNameControl = input(false, { transform: booleanAttribute });
  hideEmailControl = input(false, { transform: booleanAttribute });

  private readonly requiredEmailEffect = effect(() => {
    const emailControl = this.nameEmailGroup.controls.email;
    if (this.requiredEmail()) {
      emailControl.addValidators(Validators.required);
    } else {
      emailControl.removeValidators(Validators.required);
    }
    emailControl.updateValueAndValidity();
  });

  readonly nameEmailGroup = new FormGroup<NameEmailForm>({
    name: new FormControl<string | null>('', [Validators.maxLength(standardInputLength)]),
    email: new FormControl<string | null>('', [Validators.email, Validators.maxLength(emailInputLength)]),
  });

  ngOnInit() {
    this.parentFormDirective.form.addControl('nameEmail', this.nameEmailGroup);
  }

  ngOnDestroy() {
    this.parentFormDirective.form.removeControl('nameEmail');
  }
}
