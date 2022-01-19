import { Component, OnInit } from '@angular/core';
import { BehaviorSubject, Subscription } from 'rxjs';
import { TranslateService } from '@ngx-translate/core';

import { SeoService } from '@app/services/seo.service';
import { ApiConfig } from '@app/services/api';
import { AbstractService } from '@app/services/abstract.service';
import { NotificationsService } from '@app/services/notifications.service';
import { CmsService } from '@app/services/cms.service';
import { IHome } from '@app/services/models/cms/pages/home';
import { IWidget } from '@app/services/models/cms/widgets/widget';
import { ApplicationsService } from '@app/services/applications.service';
import { IHasImageThumbParams } from '@app/services/models/page-params';
import { APP_CONFIG } from '@app/app.config';
import { ApiModel } from '@app/services/api/api-model';
import { FeatureFlagService } from '@app/services/feature-flag.service';

/**
 * Home Component
 */
@Component({
  selector: 'app-home',
  templateUrl: './home.component.html',
  providers: [NotificationsService],
})
export class HomeComponent implements OnInit {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * App config
   */
  appConfig = APP_CONFIG;

  /**
   * Stats subscription of stats component
   */
  statsSubscription: Subscription;

  /**
   * Statistics data  of stats component
   */
  applications: any[];
  stats: any;
  categories: any;
  institutions: any;
  apiError = false;
  cmsSectionOverLatestNewsCb = new BehaviorSubject<IWidget[]>(null);
  cmsSectionOverSearchFieldCb = new BehaviorSubject<IWidget[]>(null);

  /**
   * @ignore
   */
  constructor(
    private seoService: SeoService,
    private api: AbstractService,
    public cmsService: CmsService,
    private applicationsService: ApplicationsService,
    public translateService: TranslateService,
    private featureFlagService: FeatureFlagService,
  ) {}

  /**
   * Sets META tags (title).
   */
  ngOnInit() {
    this.seoService.setPageTitleByTranslationKey(['Menu.Home']);
    this.seoService.setInitialMetaDescription();

    this.statsSubscription = this.api.getRequest(ApiConfig.stats).subscribe(
      data => {
        const { datasets_by_categories, datasets_by_institution, documents_by_type, resources_by_type } = data['meta']['aggs'];

        let stats = documents_by_type.reduce((object, item) => {
          object[item.id] = item;
          return object;
        }, {});
        stats['api'] = resources_by_type.find((item: { [key: string]: string | number }) => item['key'] === 'api');

        if (Object.keys(stats).length < 3) {
          stats = null;
        }

        this.categories = datasets_by_categories.sort((a, b) => a.title.localeCompare(b.title));
        this.institutions = datasets_by_institution.slice(0, 8);
        this.stats = stats;
        this.apiError = false;
      },
      error => (this.apiError = true),
    );

    this.getApplications();
    this.assignCmsSection();
  }

  private getApplications() {
    const params: IHasImageThumbParams = {
      page: 1,
      per_page: 4,
      q: '',
      sort: 'main_page_position',
      has_image_thumb: true,
    };

    if (this.featureFlagService.validateFlagSync('S40_innovation_routing.fe')) {
      return this.applicationsService.getAll(params, 'showcases', { key: 'sort', value: '-modified' }).subscribe(response => {
        this.applications = response.results;
      });
    } else {
      return this.applicationsService.getAll(params, 'application', { key: 'sort', value: '-modified' }).subscribe(response => {
        this.applications = response.results;
      });
    }
  }

  private assignCmsSection() {
    this.cmsService.getHomePageWidgets().subscribe((response: IHome) => {
      const home = response;
      this.cmsSectionOverLatestNewsCb.next(<IWidget[]>home.over_latest_news_cb);
      this.cmsSectionOverSearchFieldCb.next(<IWidget[]>home.over_search_field_cb);
    });
  }
}
