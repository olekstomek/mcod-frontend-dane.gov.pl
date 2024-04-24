import { Location } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, NavigationEnd, Router } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';

import { IMetadataPageChildrenCms } from '@app/services/models/cms/metadata-page-cms';

enum DGASortingEnum {
  DGA_INFORMATION = 'cms.DGAInformation',
  DGA_PROTECTED_DATA_LIST = 'cms.DGAProtectedDataList',
  DGA_ACCESS_APPLICATION = 'cms.DGAAccessApplication',
  DGA_NEW_SUB_PAGE = 'cms.DGANewSubPage'
}

@Component({
  selector: 'app-dga-information-point-tabs',
  templateUrl: './dga-information-point-tabs.component.html',
})
export class DgaInformationPointTabsComponent implements OnInit {
  tabs: IMetadataPageChildrenCms[];

  itemPositions = {
    [DGASortingEnum.DGA_INFORMATION]: 0,
    [DGASortingEnum.DGA_PROTECTED_DATA_LIST]: 1,
    [DGASortingEnum.DGA_ACCESS_APPLICATION]: 2,
    [DGASortingEnum.DGA_NEW_SUB_PAGE]: 3
  };

  detailView = false;

  constructor(
    private router: Router,
    private location: Location,
    private translateService: TranslateService,
    private route: ActivatedRoute) {
  }

  ngOnInit(): void {
    const sortedTabs = this.route.snapshot.data.post.meta.children;
    sortedTabs.sort((a, b) => this.itemPositions[a.meta.type] - this.itemPositions[b.meta.type]);
    this.tabs = sortedTabs;
    if (this.location.path().split('/').length > 3) {
      this.detailView = true;
    }
    this.router.events.subscribe((event) => {
      if (event instanceof NavigationEnd) {
        this.detailView = event.url && event.url.split('/').length > 3;
      }
    });
  }

  moveToPage(slug: string) {
    const currentLang = this.translateService.currentLang;
    const fullUrl = '/' + currentLang + '/dga/' + slug;
    this.router.navigate([fullUrl]).then();
  }

}
