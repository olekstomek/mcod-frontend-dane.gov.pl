import { Component, Input, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';


@Component({
    selector: 'app-write-us-info',
    templateUrl: './write-us-info.component.html'
})
export class WriteUsInfoComponent implements OnInit {

    @Input() textLabel: string;
    @Input() buttonLabel: string = 'WriteUs.Self';
    @Input() buttonSize: 'xs' | 'sm' | 'md' | 'lg' | 'xl' = 'lg';
    @Input() buttonLook: 'primary' | 'link' = 'primary';
    @Input() inheritLook: boolean = false;

    @ViewChild('modalTemplate') modalTemplate: TemplateRef<any>;
    writeUsModalRef: BsModalRef;
    hasButtonLook: boolean;


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
    }
}
