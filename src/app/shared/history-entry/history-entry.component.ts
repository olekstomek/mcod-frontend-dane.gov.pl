import { Component, Input, OnInit } from '@angular/core';
import { LangChangeEvent, TranslateService } from '@ngx-translate/core';

/**
 * History Entry component stands behind logic for interpreting backend historical items
 * @example
 * <app-history-entry item="${item}"></app-history-entry/>
 */
@Component({
    selector: 'app-history-entry',
    templateUrl: './history-entry.component.html'
})
export class HistoryEntryComponent implements OnInit {

    /**
     * item attribute
     */
    @Input() item: any;
    link: string;
    action: string;
    module: string;
    title: string;
    lang: string;

    /**
     * @ignore
     */
    constructor(private translate: TranslateService) {
    }

    /**
     * Translate action and table name, format variables according to entry data and pass them to template
     */
    ngOnInit() {

        this.lang = this.translate.currentLang;
        const change = this.item.attributes.new_value;
        const entry = this.item.attributes.table_name;

        const translateKeys = [
            'DatabaseOperations.' + this.item.attributes.action,
            'DatabaseTables.' + entry
        ];

        // # for more complex logic
        // if (entry.indexOf('_') !== -1) {
        //     entry = this.item.attributes.table_name.split('_')[0];
        //     subentry = this.item.attributes.table_name.split('_')[1];
        // }
        this.translate.onLangChange.subscribe((currentLang: LangChangeEvent) => {
            this.lang = currentLang.lang;
        });

        this.translate.stream(translateKeys)
            .subscribe(text => {
                this.action = text[translateKeys[0]];
                this.module = text[translateKeys[1]];

                this.title = change && change.title ? change.title : change && change.name ? change.name : '';
                const id = this.item.attributes.row_id;

                switch (entry) {
                    case 'resource':
                        this.link = change && `/dataset/${change.dataset_id}/resource/${id}`;
                        break;
                    case 'application_dataset':
                        this.link = change && `/application/${change.application_id}?dataset=${change.dataset_id}`;
                        break;
                    case 'user':
                        this.link = '';
                        this.title = change && change.email;
                        break;
                    default:
                        this.link = `/${entry}/${id}`;
                        break;
                }
                if (entry.indexOf('tag') !== -1 && change) {
                    this.link = `/dataset/${change.dataset_id}`; // TODO: ?tag=${change.tag_id} for change highlighting
                }
            });
    }

}
