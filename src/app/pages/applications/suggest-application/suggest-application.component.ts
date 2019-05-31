import { Component, OnInit, AfterViewInit, ViewChild, ElementRef, ViewChildren, QueryList } from '@angular/core';
import { FormArray, FormControl, FormGroup, Validators } from '@angular/forms';

import { SeoService } from '@app/services/seo.service';
import { ApplicationsService } from '@app/services/applications.service';
import { NotificationsService } from '@app/services/notifications.service';
import { toggleVertically } from '../../../animations/index';

/**
 * Suggest Application Component
 */
@Component({
    selector: 'app-suggest-application',
    templateUrl: './suggest-application.component.html',
    animations: [
        toggleVertically
    ]
})
export class SuggestApplicationComponent implements OnInit, AfterViewInit {
    /**
     * Application form of suggest application component
     */
    applicationForm: FormGroup;

    /**
     * Determines whether suggestion is sent
     */
    isSuggestionSent: boolean = false;

    /**
     * Uploaded image file
     */
    uploadedImageFile: File;

    /**
     * Uploaded image preview
     */
    uploadedImagePreview: any;

    /**
     * Accepted mime types
     */
    acceptedMimeTypes: string[] = ['image/jpeg', 'image/gif', 'image/png'];

    /**
     * Determines whether type of uploaded file is accepted
     */
    isImageTypeAccepted: boolean = true;

    /**
     * Image upload reference
     */
    @ViewChild('imageInput') imageInput: ElementRef;

    /**
     * Dataset input list reference
     */
    @ViewChildren('datasetInput') datasetInputs: QueryList<HTMLInputElement>;

    /**
     * External dataset title input list reference
     */
    @ViewChildren('externalDatasetTitleInput') externalDatasetTitleInputs: QueryList<HTMLInputElement>;
    
    /**
     * Max datasets number of suggest application component
     */
    maxDatasetsNumber: number = 10;

    /**
     * Max number of characters in notes (description)
     */
    maxDescriptionLength: number = 3000;
    
    /**
     * @ignore
     */
    constructor(private seoService: SeoService,
                private applicationsService: ApplicationsService,
                private notificationsService: NotificationsService) {
    }

    /**
     * Sets META tags (title). 
     * Initializes form with predefined validators
     */
    ngOnInit() {
        this.seoService.setSeoByKeys('Applications.Suggest');

        this.applicationForm = new FormGroup({
            'title': new FormControl(null, Validators.required),
            'url': new FormControl(null, [Validators.required, Validators.pattern("^(https?)[^/]+(/.*)/[^/]+$")]),
            'notes': new FormControl(null, [Validators.required, Validators.maxLength(this.maxDescriptionLength)]),
            'datasets': new FormArray([]),
            'image': new FormControl(null),
            'applicant_email': new FormControl(null, [Validators.required, Validators.email]),
            'author': new FormControl(null, Validators.required),
            'keywords': new FormControl(null),
            'external_datasets': new FormArray([]),
        });
    }

    /**
     * Submits the form
     */
    onApplicationFormSubmit() {
        if (!this.applicationForm.valid) return;

        this.notificationsService.clearAlerts();
        let formValue = {...this.applicationForm.value};

        // remove empty properties
        for (let key in formValue) {
            if (!formValue[key] || (formValue[key] && !formValue[key].length)) {
                delete formValue[key];
            }
        }     

        // internal datasets - store only dataset ids
        if (formValue['datasets'] && formValue['datasets'].length) {
            formValue['datasets'] = formValue['datasets']
                .filter(Boolean)                // remove null values
                .map(dataset => dataset['id'])  // only ids
                .reduce(function(a, b) {        // remove duplicates
                    if (a.indexOf(b) < 0 ) a.push(b);
                    return a;
                }, []);
        }        

        // keywords
        if (formValue['keywords'] && formValue['keywords'].length) {
            formValue['keywords'] = formValue['keywords']
                .toString()
                .split(',')
                .filter(Boolean)                
                .map((keyword: string) => keyword.trim());
        }   

        // external datasets
        if (formValue['external_datasets'] && formValue['external_datasets'].length) {
            formValue['external_datasets'] = formValue['external_datasets']
                .filter(item => {
                    if (item['title'] && item['url']) {
                        return item;
                    } else if (item['title'] && !item['url']) {
                        delete item['url'];
                        return item;
                    } else if (!item['title'] && item['url']) {
                        delete item['title'];
                        return item;
                    }
                }); 
        }   

        this.applicationsService
            .suggest(formValue)
            .subscribe( 
                () => this.isSuggestionSent = true,
                (error) => {
                    this.notificationsService.addError(error);
                }
            );
    }

    /**
     * Appends new, empty dataset row (input + remove button)
     */
    onAppendDatasetRow() {
        (<FormArray>this.applicationForm.get('datasets')).push(
            new FormGroup({
                'dataset': new FormControl(null),
                'id': new FormControl(null)
            })
        );
    }

    /**
     * Appends new, empty external dataset row (input + input + remove button)
     */
    onAppendExternalDatasetRow() {
        (<FormArray>this.applicationForm.get('external_datasets')).push(
            new FormGroup({
                'title': new FormControl(null),
                'url': new FormControl(null, Validators.pattern("^(https?)[^/]+(/.*)/[^/]+$"))
            })
        );
    }

    /**
     * Removes selected dataset row
     * @param {number} index
     */
    onRemoveDatasetRow(index: number) {
        (<FormArray>this.applicationForm.get('datasets')).removeAt(index);
    }

    /**
     * Removes selected external dataset row
     * @param {number} index
     */
    onRemoveExternalDatasetRow(index: number) {
        (<FormArray>this.applicationForm.get('external_datasets')).removeAt(index);
    }

    /**
     * Reads dataset chosen from autocomplete dropdown menu
     * @param {any} dataset 
     * @param {number} index 
     */
    onDatasetSelected(dataset, index: number) {
        (<FormArray>this.applicationForm.get('datasets')).at(index).setValue({
            'dataset': dataset.attributes.title,
            'id': dataset.id
        });
    }

    /**
     * Uploads an image and transforms into base64 data format
     * @param event 
     * @returns  
     */
    onFileSelected(event) {
        // 'Cancel' clicked - no image chosen
        if (!event.target.files.length) return;

        const fileToUpload: File = <File>event.target.files[0];

        // not an image
        if (this.acceptedMimeTypes.indexOf(fileToUpload.type) === -1) {
            this.isImageTypeAccepted = false;
            return;
        } else {
            this.isImageTypeAccepted = true;
        }

        this.uploadedImageFile = fileToUpload;

        const reader: FileReader = new FileReader();
        reader.readAsDataURL(fileToUpload);
        reader.onloadend = () => {
            this.uploadedImagePreview = reader.result;
            this.applicationForm.get('image').setValue(this.uploadedImagePreview);
        };
        
        
    }

    /**
     * Removes already uploaded, but not sent image
     */
    onImageRemove() {
        this.uploadedImageFile = null;
        this.uploadedImagePreview = null;
        this.isImageTypeAccepted = true;
        this.applicationForm.get('image').setValue(null);
        (<HTMLInputElement>this.imageInput.nativeElement).value = null;
    }

    /**
     * Determines whether form field is valid 
     * @param {string} field 
     * @returns {boolean} true if field valid 
     */
    isFieldValid(field: string): boolean {
        return !this.applicationForm.get(field).valid && this.applicationForm.get(field).touched;
    }

    /**
     * Sets focus on the last dataset (internal and external) input
     */
    ngAfterViewInit() {
        let datasetCount = 0;
        let externalDatasetCount = 0;

        this.datasetInputs.changes.subscribe(elements => {
            // all elements removed
            if (!elements.length) {
                datasetCount = 0;
                return;
            };

            // no change
            if (datasetCount === elements.length) 
                return;

            datasetCount = elements.length;
            (<HTMLInputElement>elements.last.nativeElement).focus();
        });

        this.externalDatasetTitleInputs.changes.subscribe(elements => {
            // all elements removed
            if (!elements.length) {
                externalDatasetCount = 0;
                return;
            };

            // no change
            if (externalDatasetCount === elements.length) 
                return;

            externalDatasetCount = elements.length;
            (<HTMLInputElement>elements.last.nativeElement).focus();
        });
    }
}
