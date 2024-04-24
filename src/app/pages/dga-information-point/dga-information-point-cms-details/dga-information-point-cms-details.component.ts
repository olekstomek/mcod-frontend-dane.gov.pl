import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IPageCms } from '@app/services/models/cms/page-cms';
import { SeoService } from '@app/services/seo.service';

@Component({
  selector: 'app-dga-information-point-cms-details',
  templateUrl: './dga-information-point-cms-details.component.html',
})
export class DgaInformationPointCmsDetailsComponent implements OnInit {

  pageData: IPageCms;
  parentUrlPath: string;

  constructor(private seoService: SeoService, private route: ActivatedRoute, private translate: TranslateService) { }

  ngOnInit(): void {
    this.pageData = this.route.snapshot.data.post;
    this.parentUrlPath = '/' + this.translate.currentLang + '/dga';
    this.seoService.setPageTitle(this.pageData.title);
  }

}
