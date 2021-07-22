import { DOCUMENT } from '@angular/common';
import { Component, Inject, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { NgForm } from '@angular/forms';
import { ActivatedRoute } from '@angular/router';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { toggleVertically } from '@app/animations/index';
import { ApiModel } from '@app/services/api/api-model';
import { DatasetService } from '@app/services/dataset.service';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { SchemaDataService } from '@app/services/schema-data.service';
import { SchemaService } from '@app/services/schema.service';
import { SeoService } from '@app/services/seo.service';
import { LinkHelper } from '@app/shared/helpers';


/**
 * Dataset Resource Component
 */
@Component({
    selector: 'app-dataset-resource',
    templateUrl: './dataset-resource.component.html',
    animations: [
        toggleVertically
    ]
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
     * @ignore 
     */
    constructor(private activatedRoute: ActivatedRoute,
                private datasetService: DatasetService,
                private seoService: SeoService,
                private schemaService: SchemaService,
                private schemaDataService: SchemaDataService,
                private modalService: BsModalService,
                @Inject(DOCUMENT) private readonly document: Document) {
    }

    /**
     * Sets META tags (title, description).
     * Initializes resource and corresponding actions.
     * Checks availability of related data (tabs).
     */
    ngOnInit() {
        this.resource = this.activatedRoute.snapshot.data.post;
        this.relatedDataset = this.activatedRoute.parent.snapshot.data.post.data;

        this.frameUrl = 'http://' + this.document.location.host + '/embed/resource/' + this.resource['id'];
        this.selfApi = this.resource.links.self;

        this.hasGeoData = this.resource.relationships.hasOwnProperty('geo_data');
        this.hasChart = this.resource.relationships.hasOwnProperty('chart');
        this.hasTabularData = this.hasGeoData || this.resource.relationships.hasOwnProperty('tabular_data');

        this.seoService.setPageTitle(this.resource.attributes.title);

        this.schemaDataService.getResourceStructuredData(this.relatedDataset.id, this.resource.id)
            .subscribe(data => {
                this.schemaService.addStructuredData(data);
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

            this.datasetService
                .sendResourceFeedback(this.resource['id'], JSON.parse(payload))
                .subscribe(() => this.feedbackSent = true);

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
