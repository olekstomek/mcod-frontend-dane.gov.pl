import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IPageCms } from '@app/services/models/cms/page-cms';
import { IDatasetFile } from '@app/services/models/dataset-resource';
import { SeoService } from '@app/services/seo.service';
import { LinkHelper } from '@app/shared/helpers';

@Component({
  selector: 'app-dga-information-point-table',
  templateUrl: './dga-information-point-table-page.component.html',
})
export class DgaInformationPointTablePageComponent implements OnInit {

  collapsed = true;
  showAnimation = false;
  parentUrlPath: string;

  pageTitle: string;
  viewsCount: string;
  downloadsCount: string;
  resourceId: string;

  dataset: any;
  resource: any;
  pageData: IPageCms;
  downloadFilesList: IDatasetFile[];
  constructor(private route: ActivatedRoute, private translate: TranslateService, private seoService: SeoService) { }

  ngOnInit(): void {
    this.resource = this.route.snapshot.data.post?.resource;
    this.pageTitle = this.resource.attributes.title;
    this.downloadFilesList = this.resource.attributes?.files;
    this.dataset = this.route.snapshot.data.post?.stats.data;
    this.viewsCount = this.dataset.attributes.views_count;
    this.downloadsCount = this.dataset.attributes.downloads_count;
    this.resourceId = this.route.snapshot.data.post?.resData.resource_id;
    this.pageData = this.route.snapshot.data.post?.cms;
    this.parentUrlPath = '/' + this.translate.currentLang + '/dga';
    this.seoService.setPageTitle(this.pageTitle);
  }

  toggleCollapsed(): void {
    if (this.collapsed) {
      this.collapsed = false;
      setTimeout(() => {
        this.showAnimation = true;
      }, 1);
    } else {
      this.showAnimation = false;
      setTimeout(() => {
        this.collapsed = true;
      }, 1000);
    }
  }

  downloadResource(title: string, url: string) {
    LinkHelper.downloadResource({ title, url });
  }

}
