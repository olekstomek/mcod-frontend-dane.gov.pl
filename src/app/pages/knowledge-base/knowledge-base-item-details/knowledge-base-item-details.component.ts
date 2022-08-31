import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { IPageCms } from '@app/services/models/cms/page-cms';
import { SeoService } from '@app/services/seo.service';

/**
 * Preview component for cms details
 */
@Component({
  selector: 'app-knowledge-base-item-details',
  templateUrl: './knowledge-base-item-details.component.html',
})
export class KnowledgeBaseItemDetailsComponent implements OnInit {
  /**
   * data from cms
   */
  pageData: IPageCms;

  /**
   * parent path url for back link
   * **/
  parentUrlPath: string;

  /**
   * @ignore
   */
  constructor(private seoService: SeoService, private route: ActivatedRoute) {}

  /**
   * Sets page data from resolved request
   */
  ngOnInit() {
    this.pageData = this.route.snapshot.data.post;
    this.seoService.setPageTitle(this.pageData.title);
    this.parentUrlPath = '/pl/knowledgebase/' + this.pageData.meta.parent.meta.slug;
  }
}
