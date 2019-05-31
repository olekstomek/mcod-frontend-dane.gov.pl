import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';
import { TranslateService } from '@ngx-translate/core';
import * as _ from 'underscore';

import { Column } from '@app/shared/datagrid/types';
import { DatasetService } from '@app/services/dataset.service';

/**
 * Embedded Component
 */
@Component({
    selector: 'app-embedded',
    templateUrl: './embedded.component.html',
    styleUrls: ['./embedded.component.scss']
})
export class EmbeddedComponent implements OnInit {
    /**
     * Tabular data
     */
    result: { columns: Column[]; data: any[] };

    /**
     * Determines whether data id loading
     */
    private isLoading: boolean = true;

    /**
     * @ignore
     */
    constructor(private datasetService: DatasetService,
                private translate: TranslateService,
                private route: ActivatedRoute) {}

    /**
     * Initializes resource of the dataset.
     * Initializes and updates tabular data (result) and component language on query params change.
     */
    ngOnInit() {
        this.result = {columns: [], data: []};

        const resourceId = this.route.snapshot.paramMap.get('id');
        const lang = this.route.snapshot.queryParamMap.get('lang');

        if (lang && ['pl', 'en'].indexOf(lang) !== -1) {
            this.translate.use(lang);
        }

        this.datasetService
            .getResourceDataById(resourceId)
            .subscribe(data => {
                this.isLoading = false;

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
}
