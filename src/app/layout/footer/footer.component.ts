import { AfterViewInit, Component, OnDestroy, TemplateRef, ViewChild } from '@angular/core';
import { BsModalRef, BsModalService } from 'ngx-bootstrap';
import { Subscription } from 'rxjs';
import { LocalStorageService } from 'ngx-localstorage';

import { environment } from '@env/environment';

@Component({
	selector: 'app-footer',
	templateUrl: './footer.component.html'
})
export class FooterComponent implements AfterViewInit, OnDestroy {

    isAcquintedWithRodo: boolean;
    @ViewChild('rodoModalTemplate') modalTemplate: TemplateRef<any>;
    rodoModalRef: BsModalRef;
    rodoModalHideSubscription: Subscription;

    storagePrefix: string = 'OD';
    env: any;


    constructor(private modalService: BsModalService,
                private localStorage: LocalStorageService) {
        this.env = environment;
    }


    ngAfterViewInit() {
        this.isAcquintedWithRodo = !!this.localStorage.get('isAcquintedWithRodo', this.storagePrefix);

        if(this.isAcquintedWithRodo) return;

        setTimeout(() => {
            this.rodoModalOpen();
        });

        this.rodoModalHideSubscription = this.modalService.onHidden.subscribe( () => {
            this.localStorage.set('isAcquintedWithRodo', 'true', this.storagePrefix);
            this.rodoModalRef = null;
        });
    }

    rodoModalOpen() {
        this.rodoModalRef = this.modalService.show(
            this.modalTemplate, {class: 'modal-lg'}
        );
    }

    ngOnDestroy() {
        this.rodoModalHideSubscription.unsubscribe();
    }
}
