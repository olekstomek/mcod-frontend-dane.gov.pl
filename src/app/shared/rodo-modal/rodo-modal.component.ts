import { Component, EventEmitter, OnInit, Output } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { CmsService } from '@app/services/cms.service';
import { CmsHardcodedPages } from '@app/services/api/api.cms.config';
import { IPageCms } from '@app/services/models/cms/page-cms';

@Component({
  selector: 'app-rodo-modal',
  templateUrl: './rodo-modal.component.html',
})
export class RodoModalComponent implements OnInit {
  @Output() isModalClosed = new EventEmitter<null>();

  pageTitle: string;
  page: Subscription;
  pageWidget = new BehaviorSubject(null);

  constructor(private cmsService: CmsService) {}

  ngOnInit() {
    this.page = this.cmsService.getSimplePage(CmsHardcodedPages.GDPR).subscribe((pageList: IPageCms) => {
      this.pageTitle = pageList.title;
      this.pageWidget.next([pageList]);
    });
  }

  closeModal() {
    this.isModalClosed.emit();
  }
}
