import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormBuilder, FormGroup } from '@angular/forms';

import { SparqlExample } from '@app/pages/dataset/sparql/domain/SparqlExample';
import { SparqlService } from '@app/pages/dataset/sparql/sparql.service';
import { TranslateService } from '@ngx-translate/core';
import { Ace, edit, EditSession, require as aceRequire } from 'ace-builds';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-sparql';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-chrome';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';


/**
 * About Component
 */
@Component({
    selector: 'app-sparql',
    templateUrl: './sparql.component.html'
})
export class SparqlComponent implements OnInit, OnDestroy {


    /**
     * Result editor instance
     * @type {Ace.Editor}
     */
    resultEditor: Ace.Editor;

    /**
     * Sparql example queries
     * @type {Array<SparqlExample>}
     */
    exampleQueries: Array<SparqlExample>;

    /**
     * Search form
     * @type {FormGroup}
     */
    searchForm: FormGroup;

    /**
     * Results count
     * @type {number}
     */
    resultCount: number;

    /**
     * Current page
     * @type {number}
     */
    currentPage: number = 1;
    /**
     * Current lang
     * @type {string}
     */
    currentLang: string;
    /**
     * Cleanup subscriptions
     * @type {Subject<void>}
     */
    private destroy$: Subject<void> = new Subject<void>();
    /**
     * Editor setup timeout reference
     * @type {number}
     */
    private editorSetupTimeout: number;

    /**
     * @ignore
     */
    constructor(private readonly sparqlService: SparqlService,
                private readonly fb: FormBuilder,
                private readonly translateService: TranslateService,
                private readonly ngZone: NgZone) {
    }

    /**
     * Initializes component
     */
    ngOnInit() {
        this.exampleQueries = this.sparqlService.getExamples();
        this.searchForm = this.fb.group({
            editor: [''],
            format: ['symbol:application/rdf+xml']
        });
        this.currentLang = this.translateService.currentLang.toLowerCase();
    }

    /**
     * Cleanups
     */
    ngOnDestroy() {
        this.resultEditor?.destroy();
        this.resultEditor?.container.remove();
        this.destroy$.next();
        this.editorSetupTimeout && clearTimeout(this.editorSetupTimeout);
    }

    /**
     * Updates editor content
     * @param content
     */
    updateEditorContent(content: string): void {
        this.searchForm.controls.editor.setValue(content);
    }

    /**
     * Makes sparql request
     */
    search(): void {
        this.sparqlService.search(this.searchForm.value.editor, this.searchForm.value.format, this.currentPage)
            .pipe(takeUntil(this.destroy$))
            .subscribe(res => {
                this.resultCount = res.meta.count;
                this.editorSetupTimeout = setTimeout(() => {
                    this.ngZone.runOutsideAngular(() => {
                        this.resultEditor = edit('sparqlResult');
                        this.resultEditor.setReadOnly(true);
                        this.resultEditor.setSession(new EditSession(res.data));
                        const EditorMode = this.getEditMode();
                        this.resultEditor.session.setMode(new EditorMode());
                        this.resultEditor.session.setUseWorker(false);
                    });
                });
            });
    }

    /**
     * Updates current page and fetch next page
     * @param page
     */
    updatePage(page: number): void {
        this.currentPage = page;
        this.search();
    }

    /**
     * Starts new search
     */
    startNewSearch() {
        this.currentPage = 1;
        this.search();
    }

    /**
     * Creates edit mode for selected data type
     * @returns {any}
     */
    private getEditMode(): any {
        let EditorMode;
        switch (this.searchForm.value.format) {
            case 'symbol:application/rdf+xml':
                EditorMode = aceRequire('ace/mode/xml').Mode;
                break;
            case 'symbol:application/sparql-results+xml':
                EditorMode = aceRequire('ace/mode/xml').Mode;
                break;
            case 'symbol:application/sparql-results+json':
                EditorMode = aceRequire('ace/mode/json').Mode;
                break;
            default:
                EditorMode = aceRequire('ace/mode/text').Mode;
                break;
        }
        return EditorMode;
    }
}
