import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { IDatasetFile } from '@app/services/models/dataset-resource';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { zip } from 'rxjs';

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
export class DatasetResourceComponent implements OnInit {
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
   * @ignore
   */
  constructor(
    private activatedRoute: ActivatedRoute,
    private datasetService: DatasetService,
    private seoService: SeoService,
    private schemaService: SchemaService,
    private schemaDataService: SchemaDataService,
    private modalService: BsModalService,
    @Inject(DOCUMENT) private readonly document: Document,
  ) {}

  /**
   * Sets META tags (title, description).
   * Initializes resource and corresponding actions.
   * Checks availability of related data (tabs).
   */
  ngOnInit() {
    this.resource = this.activatedRoute.snapshot.data.post;
    this.relatedDataset = this.activatedRoute.parent.snapshot.data.post.data;
    this.frameUrl = this.document.location.protocol + '//' + this.document.location.host + '/embed/resource/' + this.resource['id'];
    this.selfApi = this.resource.links.self;
    this.downloadFilesList = this.resource.attributes?.files;
    this.hasGeoData = this.resource.relationships.hasOwnProperty('geo_data');
    this.hasChart = this.resource.relationships.hasOwnProperty('chart');
    this.hasTabularData = this.hasGeoData || this.resource.relationships.hasOwnProperty('tabular_data');
    this.seoService.setPageTitle(this.resource.attributes.title);

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
}
