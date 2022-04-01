import { Component, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute, QueryParamsHandling, Router } from '@angular/router';
import { ListViewDetailsService } from '@app/services/list-view-details.service';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';

import { toggleHorizontally, toggleVertically } from '@app/animations';
import { ApiModel } from '@app/services/api/api-model';
import { DatasetService } from '@app/services/dataset.service';
import { ListViewFiltersService } from '@app/services/list-view-filters.service';
import { IDownloadFile } from '@app/services/models/download-item';
import { PageParams } from '@app/services/models/page-params';
import { SchemaDataService } from '@app/services/schema-data.service';
import { SchemaService } from '@app/services/schema.service';
import { SeoService } from '@app/services/seo.service';
import { LinkHelper } from '@app/shared/helpers';

/**
 * Dataset Item Component
 */
@Component({
  templateUrl: './dataset-item.component.html',
  animations: [toggleHorizontally, toggleVertically],
})
export class DatasetItemComponent implements OnInit, OnDestroy {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * Sidebar visibility indicator
   */
  sidebarVisible = true;

  /**
   * Self api of dataset item component
   */
  selfApi: string;

  /**
   * Modal template reference
   */
  @ViewChild('feedbackModalTemplate', { static: true }) modalTemplate: TemplateRef<any>;

  /**
   * Feedback modal service reference
   */
  feedbackModalRef: BsModalRef;

  /**
   * Feedback sent indicator
   */
  feedbackSent = false;

  /**
   * Basic params of dataset item component
   */
  basicParams = {
    page: 1,
    per_page: 20,
    sort: '-data_date',
  };

  /**
   * Page setting based on basic params and user interactions for resources table
   */
  params = { ...this.basicParams, include: this.apiModel.INSTITUTION };

  /**
   * Page setting based on basic params and user interactions for showcase table
   */
  paramsShowcases = this.basicParams;

  /**
   * Dataset of dataset item component
   */
  dataset: any;

  /**
   * Institution  of dataset
   */
  institution: any;

  /**
   * Resources subscription
   */
  resourcesSubscription: Subscription;

  /**
   * Showcases subscription
   */
  showcasesSubscription: Subscription;

  /**
   * Resources  of dataset
   */
  resources: any[];

  /**
   * Resources count
   */
  resourcesCount: number;

  /**
   * Showcases count
   */
  showcasesCount: number;

  /**
   * History actions list
   */
  history: any[] = [];

  /**
   * History actions - current page
   */
  historyPageNumber = 1;

  /**
   * Total number of history actions
   */
  historyTotal: number;

  /**
   * Active tab index
   */
  activeTabIndex = 1;

  /**
   * Keywords - coma separated string
   */
  keywords = '';

  /**
   * Sort options
   */
  sortOptions: { labelTranslationKey: string; value: string }[] = [
    { labelTranslationKey: 'Attribute.NameAsc', value: 'title' },
    { labelTranslationKey: 'Attribute.NameDesc', value: '-title' },
    { labelTranslationKey: 'Attribute.AvailabilityDate', value: '-created' },
    { labelTranslationKey: 'Attribute.PopularityAsc', value: 'views_count' },
    { labelTranslationKey: 'Attribute.PopularityDesc', value: '-views_count' },
  ];

  /**
   * Determines whether sort value is valid
   */
  isSortValid: boolean;

  /**
   * Determines whether user can download zip file
   */
  isExistsZipFileForDownload: boolean;

  /**
   * Items (related showcases)
   */
  items: any[] = [];

  /**
   * @ignore
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private filterService: ListViewFiltersService,
    private router: Router,
    private datasetService: DatasetService,
    private seoService: SeoService,
    private schemaService: SchemaService,
    private schemaDataService: SchemaDataService,
    private modalService: BsModalService,
    private listViewDetailsService: ListViewDetailsService,
  ) {}

  /**
   * Sets META tags (title, description).
   * Initializes dataset,its institution and history.
   * Initializes and updates list of items (resources) on query params change.
   */
  ngOnInit() {
    const { data: dataset, included: datasetRelated } = this.activatedRoute.snapshot.data.post;

    if (Array.isArray(dataset.attributes.keywords)) {
      this.keywords = (dataset.attributes.keywords as []).join(', ');
    }

    this.dataset = dataset;
    this.selfApi = this.dataset.links.self;
    this.isExistsZipFileForDownload = this.dataset.attributes.archived_resources_files_url ? true : false;

    if (this.dataset.attributes.source && this.dataset.attributes.source.type === 'ckan') {
      this.basicParams.sort = '-created';
    } else {
      this.sortOptions.splice(3, 0, { labelTranslationKey: 'Attribute.DataDate', value: '-data_date' });
    }

    this.seoService.setPageTitle(this.dataset.attributes.title);
    this.seoService.setDescriptionFromText(this.dataset.attributes.notes);

    this.schemaDataService.getDatasetStructuredData(this.dataset.id).subscribe(data => {
      this.schemaService.addStructuredData(data);
    });

    this.institution = datasetRelated.find(item => item.type === this.apiModel.INSTITUTION);

    this.resourcesSubscription = this.activatedRoute.queryParamMap
      .pipe(
        switchMap(qParamMap => {
          if (qParamMap.get('model') === 'resources' || qParamMap.get('model') === null) {
            this.params = {
              page: +qParamMap.get('page') || this.basicParams['page'],
              per_page: +qParamMap.get('per_page') || this.basicParams['per_page'],
              sort: qParamMap.get('sort') || this.basicParams['sort'],
              include: this.apiModel.INSTITUTION,
            };

            return this.datasetService.getResourcesList(this.dataset.id, this.params);
          } else {
            this.params = {
              page: this.params['page'],
              per_page: this.params['per_page'],
              sort: this.params['sort'],
              include: this.apiModel.INSTITUTION,
            };

            return this.datasetService.getResourcesList(this.dataset.id, this.params);
          }
        }),
      )
      .subscribe(response => {
        this.resources = response.results;
        this.resourcesCount = response.count;
        this.isSortValid = !!this.sortOptions.find(option => option.value === this.params.sort);
      });

    if (this.dataset.relationships.showcases.meta.count > 0) {
      this.showcasesSubscription = this.activatedRoute.queryParamMap
        .pipe(
          switchMap(qParamMap => {
            if (qParamMap.get('model') === 'showcases' || qParamMap.get('model') === null) {
              this.paramsShowcases = {
                page: +qParamMap.get('page') || this.basicParams['page'],
                per_page: +qParamMap.get('per_page') || this.basicParams['per_page'],
                sort: qParamMap.get('sort') || this.basicParams['sort'],
              };
              return this.datasetService.getShowcasesList(this.dataset.id, this.paramsShowcases);
            } else {
              this.paramsShowcases = {
                page: this.paramsShowcases['page'],
                per_page: this.paramsShowcases['per_page'],
                sort: this.paramsShowcases['sort'],
              };
              return this.datasetService.getShowcasesList(this.dataset.id, this.paramsShowcases);
            }
          }),
        )
        .subscribe(showcases => {
          showcases.results.forEach(data => {
            data.attributes.model = 'showcase';
          });
          const results = showcases.results ? showcases.results : [];
          this.items = this.listViewDetailsService.extendViewDetails(results);
          this.showcasesCount = showcases.count;
          this.isSortValid = !!this.sortOptions.find(option => option.value === this.paramsShowcases.sort);
        });
    }

    this.loadHistory(this.historyPageNumber);
  }

  /**
   * Loads dataset history actions
   * @param {number} page
   */
  public loadHistory(page: number) {
    this.historyPageNumber = page;

    this.datasetService.getHistoryById(this.dataset.id, page).subscribe(history => {
      this.historyTotal = history.meta.count;
      this.history = this.history.concat(history.data);
    });
  }

  /**
   * Updates query params on every user interaction
   * @param {PageParams} params
   * @param {QueryParamsHandling | null} method
   */
  updateParams(params: PageParams, model: string, method: QueryParamsHandling | null = 'merge') {
    let updatedBasicParams;
    switch (model) {
      case 'resources':
        updatedBasicParams = this.filterService.updateBasicParams(this.params, this.basicParams);
        break;
      case 'showcases':
        updatedBasicParams = this.filterService.updateBasicParams(this.paramsShowcases, this.basicParams);
        break;
    }

    if (!('page' in params)) {
      params['page'] = 1;
    }

    this.router.navigate([], {
      queryParams: {
        ...updatedBasicParams,
        ...params,
        model,
      },
      queryParamsHandling: method,
    });
  }

  /**
   * Increments download counter and initializes resource (file) download
   * @param {IDownloadFile} file
   */
  downloadResource(file: IDownloadFile) {
    LinkHelper.downloadResource(file);
  }

  /**
   * Sends feedback on feedback form submits
   * @param feedbackForm
   */
  sendFeedback(feedbackForm: NgForm) {
    if (feedbackForm.valid && feedbackForm.value.feedback) {
      const payload = `{
                "data": {
                    "type": "comment",
                    "attributes": {
                        "comment": ${JSON.stringify(feedbackForm.value.feedback)}
                    }
                }
            }`;

      this.datasetService.sendDatasetFeedback(this.dataset['id'], JSON.parse(payload)).subscribe(() => (this.feedbackSent = true));
    }
  }

  /**
   * Opens feedback modal
   * @param template
   */
  openFeedbackModal(template: TemplateRef<any>) {
    this.feedbackSent = false;
    this.feedbackModalRef = this.modalService.show(template);
  }

  /**
   * Closes feedback modal
   */
  onFeedbackModalClose() {
    this.feedbackModalRef.hide();
    this.feedbackModalRef = null;
    this.feedbackSent = false;
  }

  /**
   * Unsubscribe from existing subscriptions
   */
  ngOnDestroy() {
    this.resourcesSubscription.unsubscribe();
    if (this.showcasesSubscription) {
      this.showcasesSubscription.unsubscribe();
    }
  }
}
