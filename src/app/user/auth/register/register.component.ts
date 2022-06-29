import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { Component, OnInit, ViewChild, TemplateRef, ElementRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { UserService } from '@app/services/user.service';
import { IRegistration } from '@app/services/models';
import { SeoService } from '@app/services/seo.service';
import { NotificationsService } from '@app/services/notifications.service';
import { toggleVertically } from '@app/animations';
import { equalValueValidator } from '../equal-value-validator';
import { CustomFormControlValidators } from '@app/shared/form-validators/string.validators';

/**
 * Register Component
 */
@Component({
  templateUrl: './register.component.html',
  animations: [toggleVertically],
})
export class RegisterComponent implements OnInit {
  /**
   * Registration form of register component
   */
  registrationForm: FormGroup;

  /**
   * Determines whether a user is registered
   */
  isRegistered = false;

  /**
   * Determines password min length
   */
  passwordMinLength: number;

  /**
   * Determines whether to show password hint
   */
  showPasswordHint = false;

  rodoModalRef: BsModalRef;
  @ViewChild('rodoModalTemplate') modalTemplate: TemplateRef<any>;

  /**
   * Rodo modal trigger (button) reference
   */
  @ViewChild('rodoModalTrigger', { static: false }) rodoModalTrigger: ElementRef;

  /**
   * @ignore
   */
  constructor(
    private formBuilder: FormBuilder,
    private seoService: SeoService,
    private userService: UserService,
    private notificationsService: NotificationsService,
    private modalService: BsModalService,
  ) {}

  /**
   * Sets META tags (title).
   * Initializes registration form and its validators.
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Action.Register']);

    this.passwordMinLength = this.userService.passwordMinLength;
    const customValidators = this.userService.passwordCustomValidators.map(validator => {
      return CustomFormControlValidators.checkString(validator[0], validator[1]);
    });

    this.registrationForm = this.formBuilder.group(
      {
        email: ['', [Validators.required, Validators.email]],
        password1: ['', [Validators.required, Validators.minLength(this.userService.passwordMinLength), ...customValidators]],
        password2: ['', Validators.required],
        rodoConsent: [false, Validators.requiredTrue],
        regulationsConsent: [false, Validators.requiredTrue],
      },
      { validator: equalValueValidator('password1', 'password2') },
    );
  }

  /**
   * Registers a user on form submit. Clears API errors (if any).
   */
  onSubmit() {
    if (this.registrationForm.invalid) {
      return;
    }

    this.notificationsService.clearAlerts();
    const { email, password1, password2 } = this.registrationForm.value as IRegistration;

    this.userService
      .registerUser({
        email,
        password1,
        password2,
        subscriptions_report_opt_in: true,
        rodo_privacy_policy_opt_in: true,
      })
      .subscribe(() => {
        this.isRegistered = true;
      });
  }

  onRodoModalOpen(event) {
    event.preventDefault();
    this.rodoModalRef = this.modalService.show(this.modalTemplate, { class: 'modal-lg' });
  }

  onRodoModalClose() {
    this.rodoModalRef.hide();
    (<HTMLButtonElement>this.rodoModalTrigger.nativeElement).focus();
  }
}
