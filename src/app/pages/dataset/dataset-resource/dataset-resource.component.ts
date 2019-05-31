import { Component, OnInit, TemplateRef, ViewChild } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { NgForm } from '@angular/forms';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { switchMap } from 'rxjs/operators';
import * as _ from 'underscore';

import { Column } from '@app/shared/datagrid/types';
import { SeoService } from '@app/services/seo.service';
import { DatasetService } from '@app/services/dataset.service';
import { LinkHelper } from '@app/shared/helpers';
import { toggleVertically } from '../../../animations/index';

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
     * Tabular data
     */
    result: { columns: Column[]; data: any[] };

    /**
     * Resource  of dataset 
     */
    resource: any;

    /**
     * Resource id
     */
    resourceId: string | null;

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
    feedbackSent: boolean = false;

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
     * Dataset  of dataset resource component
     */
    dataset: any;

    /**
     * Determines whether data is loading
     */
    isLoading: boolean = true;

    /**
     * @ignore
     */
    constructor(private activatedRoute: ActivatedRoute,
                private datasetService: DatasetService,
                private seoService: SeoService,
                private modalService: BsModalService) {
    }

    /**
     * Sets META tags (title, description). 
     * Initializes dataset and its resource.
     * Initializes and updates tabular data (result) on query params change.
     */
    ngOnInit() {
        this.result = {columns: [], data: []};
        this.dataset = this.activatedRoute.snapshot.parent.data.post.data;
        this.resource = this.activatedRoute.snapshot.data.post;

        this.seoService.setPageTitle(this.resource.attributes.title);
        this.seoService.setPageDescription(this.resource.attributes.title);

        this.activatedRoute.paramMap
            .pipe(
                switchMap(routeParams => {
                    this.resourceId = routeParams.get('resourceId');
                    this.frameUrl = 'http://' + document.location.host + '/embed/resource/' + this.resourceId;
    
                    return this.datasetService.getResourceDataById(this.resourceId);
                })
            )
            .subscribe(data => {
                this.isLoading = false;
                this.selfApi = this.datasetService.base_url + this.resource.links.self;

                if (data) {
                    data.attributes.headers.forEach(item => {
                        this.result.columns.push(new Column(item, item));
                    });

                    const items = [];
                    data.attributes.data.forEach(item => {
                        items.push(_.object(data.attributes.headers, item));
                    });

                    this.result.data = items;
                }
            });
    }

    /**
     * Opens modal width iframe settings
     * @param {TemplateRef<any>} template 
     */
    openModal(template: TemplateRef<any>) {
        this.modal = this.modalService.show(template, {class: 'modal-lg'});
    }

    /**
     * Increments download counter and initializes resource (file) download.
     * @param resource 
     * @returns {boolean}
     */
    downloadResource(resource) {
        this.datasetService
            .tickDownloadCounter(resource.id)
            .subscribe(() => {});
        // Fire away download right after click, regardless of api response, 
        // to not get cought in browser's pop up guard
        return LinkHelper.downloadFile(resource.attributes.file_url);
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
