import { Component, Input, OnInit, TemplateRef, ViewChild, ElementRef } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { APP_CONFIG } from '@app/app.config';

@Component({
  selector: 'app-write-us-info',
  templateUrl: './write-us-info.component.html',
})
export class WriteUsInfoComponent implements OnInit {
  @Input() textLabel: string;
  @Input() buttonLabel = 'WriteUs.Self';
  @Input() buttonSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'lg';
  @Input() buttonLook: 'primary' | 'link' = 'primary';
  @Input() inheritLook = false;
  @Input() uppercase = true;
  @Input() showIcon = true;

  /**
   * Modal trigger (button) reference
   */
  @ViewChild('modalTrigger', { static: false }) modalTrigger: ElementRef;
  @ViewChild('modalTemplate', { static: false }) modalTemplate: TemplateRef<any>;
  writeUsModalRef: BsModalRef;
  hasButtonLook: boolean;

  /**
   * App config
   */
  appConfig = APP_CONFIG;

  constructor(private modalService: BsModalService) {}

  ngOnInit() {
    this.hasButtonLook = this.buttonLook !== 'link';
  }

  openWriteUsModal(template: TemplateRef<any>) {
    this.writeUsModalRef = this.modalService.show(template);
  }

  onWriteUsModalClose() {
    this.writeUsModalRef.hide();
    this.writeUsModalRef = null;
    (<HTMLButtonElement>this.modalTrigger.nativeElement).focus();
  }
}
