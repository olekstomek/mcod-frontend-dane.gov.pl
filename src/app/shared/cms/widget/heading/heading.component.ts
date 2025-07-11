import { Component, Input, OnInit } from '@angular/core';
import { WidgetAbstractComponent } from '@app/shared/cms/widget/widget.abstract.component';
import { CmsService } from '@app/services/cms.service';
import { DomSanitizer } from '@angular/platform-browser';
import { IWidget } from '@app/services/models/cms/widgets/widget';

@Component({
    selector: 'cms-heading',
    templateUrl: './heading.component.html'
})
export class HeadingComponent extends WidgetAbstractComponent implements OnInit {

    @Input() heading: IWidget;

    style: any;

    constructor(cmsService: CmsService, sanitizer: DomSanitizer) {
        super(cmsService, sanitizer);
    }

    ngOnInit() {
        this.style = this.cmsService.addStyle(this.heading);
    }
}
