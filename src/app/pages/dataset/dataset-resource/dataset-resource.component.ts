import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnDestroy, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { IDatasetFile, IDatasetRegionsList } from '@app/services/models/dataset-resource';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { ISearchResult } from '@app/services/models/search';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subscription, zip } from 'rxjs';

import { toggleVertically } from '@app/animations/index';
import { ApiModel } from '@app/services/api/api-model';
import { DatasetService } from '@app/services/dataset.service';
import { SchemaDataService } from '@app/services/schema-data.service';
import { SchemaService } from '@app/services/schema.service';
import { SeoService } from '@app/services/seo.service';
import { LinkHelper } from '@app/shared/helpers';
import { ActivatedRouteHelper } from '@app/shared/helpers/activated-route.helper';

/**
 * Dataset Resource Component
 */
@Component({
  selector: 'app-dataset-resource',
  templateUrl: './dataset-resource.component.html',
  animations: [toggleVertically],
})
export class DatasetResourceComponent implements OnInit, OnDestroy {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * Resource  of dataset
   */
  resource: any;

  /**
   * Related dataset of dataset resource component
   */
  relatedDataset: any;

  /**
   * Self api of dataset resource component
   */
  selfApi: string;

  /**
   * Modal template reference
   */
  @ViewChild('feedbackModalTemplate') modalTemplate: TemplateRef<any>;

  /**
   * Feedback modal service reference
   */
  feedbackModalRef: BsModalRef;

  /**
   * Feedback sent indicator
   */
  feedbackSent = false;

  /**
   * Modal including iIframe
   */
  modal: BsModalRef;

  /**
   * Resource details iframe width
   */
  frameWidth = 700;

  /**
   * Resource details iframe height
   */
  frameHeight = 400;

  /**
   * Resource details iframe url
   */
  frameUrl: string;

  /**
   * Determines whether resource has tabular view
   */
  hasTabularData = false;

  /**
   * Determines whether resource has chart view
   */
  hasChart = false;

  /**
   * Determines whether resource has geo view
   */
  hasGeoData = false;

  /**
   * Determines whether special signs block is expanded
   */
  isSpecialSignsExpanded = false;

  /**
   * Determines whether chart tab is hidden
   */
  isChartTabHidden = false;

  /**
   * list of files to download
   */
  downloadFilesList: IDatasetFile[];

  /**
   * Current supplement state - is not expanded
   */
  isSupplementExpanded = false;

  /**
   * Current regions state - is not expanded
   */
  isRegionsExpanded = false;

  /**
   * Dataset regions list
   */
  regionsList: IDatasetRegionsList[];

  /**
   * Show container if exist regions without Poland
   */
  isNotRegionPoland: boolean;

  /**
   * list of related resources
   */
  relatedResources: any[];

  /**
   * Resources subscription of resource item component
   */
  resourcesSubscription: Subscription;

  /**
   * Router endpoints
   */
  readonly routerEndpoints = RouterEndpoints;

  /**
   * @ignore
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private datasetService: DatasetService,
    private seoService: SeoService,
    private schemaService: SchemaService,
    private schemaDataService: SchemaDataService,
    private modalService: BsModalService,
    private featureFlagService: FeatureFlagService,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  /**
   * Sets META tags (title, description).
   * Initializes resource and corresponding actions.
   * Checks availability of related data (tabs).
   */
  ngOnInit() {
    this.resourcesSubscription = this.activatedRoute.url.subscribe(res => {
      this.relatedResources = [];
      this.resource = this.activatedRoute.snapshot.data.post;
      this.relatedDataset = this.activatedRoute.parent.snapshot.data.post.data;
      this.frameUrl = this.document.location.protocol + '//' + this.document.location.host + '/embed/resource/' + this.resource['id'];
      this.selfApi = this.resource.links.self;
      this.downloadFilesList = this.resource.attributes?.files;
      this.hasGeoData = this.resource.relationships.hasOwnProperty('geo_data');
      this.hasChart = this.resource.relationships.hasOwnProperty('chart');
      this.hasTabularData = this.hasGeoData || this.resource.relationships.hasOwnProperty('tabular_data');
      this.seoService.setPageTitle(this.resource.attributes.title);
      this.regionsList = this.resource.attributes.regions.filter(region => region.is_additional === false);
      this.isNotRegionPoland = this.regionsList.filter(region => region.region_id !== '85633723').length > 0 ? true : false;

      zip(
        this.schemaDataService.getResourceStructuredData(this.relatedDataset.id, this.resource.id),
        this.datasetService.getResourceChartById(this.resource.id),
      ).subscribe(([structuredData, chartResponse]) => {
        this.schemaService.addStructuredData(structuredData);
        const isEditorPreview = ActivatedRouteHelper.getRouteData(this.activatedRoute, 'editorPreview');

        if (this.resource.attributes.hasOwnProperty('is_chart_creation_blocked')) {
          this.isChartTabHidden = this.resource.attributes['is_chart_creation_blocked'] && !chartResponse.data.length && !isEditorPreview;
        }
      });

      if (this.featureFlagService.validateFlagSync('S54_resource_language.fe')) {
        if (this.resource.relationships.related_resource) {
          const slug = this.resource.relationships.related_resource.links.related.split(',')[1];
          this.datasetService.getResourceById(this.resource.relationships.related_resource.data.id).subscribe(response => {
            this.relatedResources = this.extendViewDetails([response], slug, response.attributes.description);
          });
        }
      }
    });
  }

  /**
   * Extends related resource object with translations and details to display on list
   * @param {ISearchResult[]} relatedResource
   * @param {string} slug
   * @param {string} description
   * @return {ISearchResult[]}
   */
  extendViewDetails(relatedResource: ISearchResult[], slug: string, description: string): ISearchResult[] {
    relatedResource.map(item => {
      item.url = `../../${this.routerEndpoints.RESOURCES}/${item.id},${slug}`;
      item.titleTranslationKey = 'Resources.Single';
      item.attributes.notes = description;
      item.attributes.slug = slug;
      const isHarvested = item.attributes.source && item.attributes.source.type === 'ckan';
      item.detailsData = [
        {
          titleTranslationKey: isHarvested ? 'Attribute.AvailabilityDate' : 'Attribute.DataDate',
          dateFormat: isHarvested ? 'D MMMM YYYY, HH:mm' : 'D MMMM YYYY',
          data: isHarvested ? item.attributes.created : item.attributes.data_date,
          isDate: true,
          language: item.attributes.language,
        },
      ];
    });

    return relatedResource;
  }

  /**
   * Opens modal width iframe settings
   * @param {TemplateRef<any>} template
   */
  openModal(template: TemplateRef<any>) {
    this.modal = this.modalService.show(template, { class: 'modal-lg' });
  }

  /**
   * Increments download counter and initializes resource (file) download.
   * @param {string} title
   * @param {string} url
   */
  downloadResource(title: string, url: string) {
    LinkHelper.downloadResource({ title, url });
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

      this.datasetService.sendResourceFeedback(this.resource['id'], JSON.parse(payload)).subscribe(() => (this.feedbackSent = true));
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
   * Unsubscribes from existing subscriptions
   */
  ngOnDestroy() {
    this.resourcesSubscription.unsubscribe();
  }
}
