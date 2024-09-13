import { Component, OnInit } from '@angular/core';
import { FormGroup, FormControl, Validators } from '@angular/forms';

import { toggleVertically } from '@app/animations';
import { ScheduleNotificationsService } from '@app/user/schedule/services/schedule-notifications.service';
import { ScheduleNotificationRecipientType } from '@app/user/schedule/services/schedule-notification-recipient-type';

@Component({
  selector: 'app-schedule-notifications-form',
  templateUrl: './schedule-notifications-form.component.html',
  animations: [toggleVertically],
})
export class ScheduleNotificationsFormComponent implements OnInit {
  /**
   * Notification form
   */
  notificationForm: FormGroup;

  /**
   * Min notification length
   */
  minNotificationLength = 3;

  /**
   * Max notification length
   */
  maxNotificationLength = 60;

  /**
   * Recipient type option list
   */
  recipientTypes: ScheduleNotificationRecipientType[];
  /**
   * Notification sent message
   */
  notificationSentMessage: string;

  /**
   * @ignore
   */
  constructor(private scheduleNotificationsService: ScheduleNotificationsService) {}

  /**
   * Inits the form
   */
  ngOnInit(): void {
    this.initForm();
  }

  /**
   * Inits the form
   */
  initForm() {
    this.recipientTypes = this.scheduleNotificationsService.getRecipientTypes();

    this.notificationForm = new FormGroup({
      message: new FormControl(null, [
        Validators.required,
        Validators.minLength(this.minNotificationLength),
        Validators.maxLength(this.maxNotificationLength),
      ]),
      type: new FormControl(null),
    });

    if (this.recipientTypes?.length) {
      this.notificationForm.patchValue({ type: this.recipientTypes[1].value });
    }
  }

  /**
   * Submits the form
   */
  onFormSubmit() {
    if (this.notificationForm.invalid) {
      return false;
    }

    this.scheduleNotificationsService.sendNotification(this.notificationForm.value).subscribe(response => {
      this.notificationSentMessage = response.data.attributes.result;
      this.notificationForm.reset();
    });
  }

  /**
   * Toggles form
   */
  onToggleForm() {
    this.notificationSentMessage = null;
  }
}
