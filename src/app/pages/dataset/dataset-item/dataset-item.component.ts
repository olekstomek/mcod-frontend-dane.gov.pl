import { ActivatedRoute, Router } from '@angular/router';
import { QueryParamsHandling } from '@angular/router/src/config';
import { Component, OnInit, ViewChild, TemplateRef, OnDestroy } from '@angular/core';
import { NgForm } from '@angular/forms';
import { Subscription } from 'rxjs';
import { switchMap } from 'rxjs/operators';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';

import { SeoService } from '@app/services/seo.service';
import { DatasetService } from '@app/services/dataset.service';
import { LinkHelper } from '@app/shared/helpers';
import { toggleHorizontally, toggleVertically } from '../../../animations/index';

/**
 * Dataset Item Component
 */
@Component({
    templateUrl: './dataset-item.component.html',
    animations: [
        toggleHorizontally,
        toggleVertically
    ]
})
export class DatasetItemComponent implements OnInit, OnDestroy {
    /**
     * Sidebar visiblity indicator
     */
    sidebarVisible: boolean = true;

    /**
     * Self api of dataset item component
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
     * Page setting based on basic params and user interactions
     */
    params: any;

    /**
     * Basic params of dataset item component
     */
    basicParams = {
        page: 1,
        per_page: 5,
        sort: '-verified',
    };

    /**
     * Dataset  of dataset item component
     */
    dataset: any;
    
    /**
     * Institution  of dataset 
     */
    institution: any;

    /**
     * Determines whether dataset has legal restrictions
     */
    hasRestrictions: boolean;

    /**
     * Resources subsciption
     */
    resourcesSubsciption: Subscription;

    /**
     * Resources  of dataset
     */
    resources: any[];

    /**
     * Determines whether resources are sorted by date
     */
    isSortedByDate: boolean = false;

    /**
     * Resources count 
     */
    resourcesCount: number;

    /**
     * History visibility indicator
     */
    historyVisible: boolean = false;

    /**
     * History actions list
     */
    history: any[] = [];

    /**
     * History actions - current page
     */
    historyPageNumber: number = 1;

    /**
     * Total number of history actions
     */
    historyTotal: number;


    /**
     * @ignore
     */
    constructor(private activatedRoute: ActivatedRoute,
                private router: Router,
                private datasetService: DatasetService,
                private seoService: SeoService,
                private modalService: BsModalService) {
    }

    /**
     * Sets META tags (title, description). 
     * Initializes dataset,its institution and history.
     * Initializes and updates list of items (resources) on query params change.
     */
    ngOnInit() {
        this.dataset = this.activatedRoute.snapshot.parent.data.post.data;
        this.selfApi = this.datasetService.base_url + this.dataset.links.self;

        this.seoService.setPageTitle(this.dataset.attributes.title);
        this.seoService.setDescriptionFromText(this.dataset.attributes.notes);

        const institutionId = +this.dataset.relationships.institution.data.id;

        if (this.dataset.attributes.license_condition_source ||
            this.dataset.attributes.license_condition_original ||
            this.dataset.attributes.license_condition_modification ||
            this.dataset.attributes.license_condition_responsibilities ||
            this.dataset.attributes.license_condition_db_or_copyrighted
        ) {
            this.hasRestrictions = true;
        } else
            this.hasRestrictions = false;

        // TODO: move to dataset.service
        this.institution = this.activatedRoute.snapshot.parent.data.post.included.find(item => {
            return item.id === institutionId && item.type === 'institution';
        });

        this.resourcesSubsciption =  this.activatedRoute.queryParamMap
            .pipe(     
                switchMap(qParamMap => {
                    this.params = {
                        page: +qParamMap.get('page') || this.basicParams['page'],
                        per_page: +qParamMap.get('per_page') || this.basicParams['per_page'],
                        sort: qParamMap.get('sort') || this.basicParams['sort']
                    };

                    return this.datasetService.getResourcesList(this.dataset.id, this.params)
                })
            )
            .subscribe(response => {
                this.resources = response.results;
                this.resourcesCount = response.count;

                this.checkSortByDate();
            });

        this.loadHistory(this.historyPageNumber);
    }

    /**
     * Loads dataset history actions
     * @param {number} page 
     */
    public loadHistory(page: number) {
        this.historyPageNumber = page;

        this.datasetService
            .getHistoryById(this.dataset.id, page)
            .subscribe(history => {
                this.historyTotal = history.meta.count;
                this.history = this.history.concat(history.data);
            });
    }

    /**
     * Updates query params on every user interaction
     * @param params 
     * @param {QueryParamsHandling | null} method 
     */
    updateParams(params: any, method: QueryParamsHandling | null = 'merge') {
        const updatedBasicParams = {
            page: +this.params['page'] || this.basicParams['page'],
            per_page: +this.params['per_page'] || this.basicParams['per_page'],
            sort: this.params['sort'] || ''
        }
        
        if ( !('page' in params) ) params['page'] = 1;

        this.router.navigate([], {queryParams: {
            ...updatedBasicParams,
            ...params
        }, queryParamsHandling: method});
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
                .sendDatasetFeedback(this.dataset['id'], JSON.parse(payload))
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

    /**
     * Checks whether resources are sorted by date
     */
    checkSortByDate() {
        if (!this.params) return;

        if (this.params.sort.indexOf('created') !== -1 || 
            this.params.sort.indexOf('verified') !== -1 ||
            this.params.sort.indexOf('data_date') !== -1
        ) {
            this.isSortedByDate = true;
        } else {
            this.isSortedByDate = false;
        }
    }

    /**
     * Unsubscribe from existing subscriptions
     */
    ngOnDestroy() {
        this.resourcesSubsciption.unsubscribe();
    }
}
