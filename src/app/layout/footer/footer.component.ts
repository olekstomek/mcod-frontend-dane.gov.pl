import { DOCUMENT, isPlatformBrowser } from '@angular/common';
import { AfterViewInit, Component, ElementRef, Inject, OnDestroy, OnInit, PLATFORM_ID, TemplateRef, ViewChild } from '@angular/core';
import { environment } from '@env/environment';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { LocalStorageService } from 'ngx-localstorage';
import { Subscription } from 'rxjs';

import { APP_CONFIG } from '@app/app.config';
import { ApiConfig } from '@app/services/api';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';

@Component({
    selector: 'app-footer',
    templateUrl: './footer.component.html'
})
export class FooterComponent implements OnInit, AfterViewInit, OnDestroy {
    /**
     * Router endpoints
     */
    readonly routerEndpoints = RouterEndpoints;

    /**
     * Acquinted With RODO status
     */
    isAcquintedWithRodo: boolean;

    /**
     * Rodo modal trigger (button) reference
     */
    @ViewChild('rodoModalTrigger', {static: false}) rodoModalTrigger: ElementRef;

    /**
     * RODO modal reference
     */
    @ViewChild('rodoModalTemplate') modalTemplate: TemplateRef<any>;
    rodoModalRef: BsModalRef;

    /**
     * RODO modal hide subscription
     */
    rodoModalHideSubscription: Subscription;

    /**
     * App prefix in local storage
     */
    storagePrefix = 'OD';

    /**
     * Current version of app
     */
    currentVersion = environment.VERSION;

    /**
     * App config
     */
    appConfig = APP_CONFIG;

    /**
     * Rdf documentation link
     * @type {string}
     */
    rdfDocumentationURL: string;

    /**
     * Determines whether rodo modal is opened from footer
     */
    isRodoModalOpenedByClick = false;

    /**
     * @ignore
     */
    constructor(private modalService: BsModalService,
                private localStorage: LocalStorageService,
                @Inject(DOCUMENT) private document: Document,
                @Inject(PLATFORM_ID) private platformId: string) {
    }

    /**
     * Setups rdf documentation link
     */
    ngOnInit(): void {
        this.getRDFDocumentationURL();
    }


    /**
     * Shows RODO Modal if user doesn't accepted it before
     */
    ngAfterViewInit() {
        if (isPlatformBrowser(this.platformId)) {
            this.isAcquintedWithRodo = !!this.localStorage.get('isAcquintedWithRodo', this.storagePrefix);

            if (this.isAcquintedWithRodo) {
                return;
            }

            setTimeout(() => {
                this.rodoModalOpen();
            });

            this.rodoModalHideSubscription = this.modalService.onHidden.subscribe(() => {
                this.localStorage.set('isAcquintedWithRodo', 'true', this.storagePrefix);
                this.rodoModalRef = null;
            });
        }
    }

    /**
     * Opens RODO modal
     */
    onRodoModalOpen() {
        this.rodoModalOpen();
        this.isRodoModalOpenedByClick = true;
    }

    /**
     * Closes RODO modal
     */
    rodoModalClose() {
        this.rodoModalRef.hide();

        if (this.isRodoModalOpenedByClick) {
            (<HTMLButtonElement>this.rodoModalTrigger.nativeElement).focus();
        }
    }

    /**
     * Unsubscribes from RODO modal hide subscription
     */
    ngOnDestroy() {
        if (isPlatformBrowser(this.platformId && this.rodoModalHideSubscription)) {
            this.rodoModalHideSubscription.unsubscribe();
        }
    }

    /**
     * Opens RODO modal
     */
    private rodoModalOpen() {
        this.rodoModalRef = this.modalService.show(
            this.modalTemplate, {class: 'modal-lg'}
        );
    }

    /**
     * Setups rdf documentation link
     */
    private getRDFDocumentationURL(): void {
        let baseURL: string;
        if (!environment.production) {
            baseURL = '/api';
        } else {
            baseURL = this.document.location.protocol + '//api.' + this.document.location.hostname.replace('www.', '');
        }
        this.rdfDocumentationURL = baseURL + ApiConfig.apiVersion + ApiConfig.rdfDoc;
    }
}
