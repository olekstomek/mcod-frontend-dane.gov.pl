import { NgFor, NgIf } from '@angular/common';
import { Component, NgZone, OnDestroy, OnInit } from '@angular/core';
import { FormsModule, ReactiveFormsModule, UntypedFormBuilder, UntypedFormGroup } from '@angular/forms';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import * as ace from 'ace-builds';
import { EditSession } from 'ace-builds';
import { beautify } from 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/src-noconflict/ext-beautify';
import 'ace-builds/src-noconflict/mode-json';
import 'ace-builds/src-noconflict/mode-text';
import 'ace-builds/src-noconflict/mode-xml';
import 'ace-builds/src-noconflict/theme-chrome';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';
import { SparqlEditorComponent } from './editor/sparql-editor-component';

import { SparqlExample } from '@app/pages/dataset/sparql/domain/SparqlExample';
import { SparqlService } from '@app/pages/dataset/sparql/sparql.service';
import { NotificationsService } from '@app/services/notifications.service';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';

/**
 * About Component
 */
@Component({
  selector: 'app-sparql',
  templateUrl: './sparql.component.html',
  standalone: true,
  imports: [
    FormsModule,
    ReactiveFormsModule,
    SparqlEditorComponent,
    NgIf,
    NgFor,
    NotificationsServerComponent,
    PaginationComponent,
    TranslatePipe,
  ],
})
export class SparqlComponent implements OnInit, OnDestroy {
  /**
   * Result editor instance
   * @type {Ace.Editor}
   */
  resultEditor: ace.Editor;

  /**
   * Sparql example queries for dane.gov.pl
   * @type {Array<SparqlExample>}
   */
  exampleQueriesForDane: SparqlExample[];

  /**
   * Sparql example queries for Kronik@
   * @type {Array<SparqlExample>}
   */
  exampleQueriesForKronika: SparqlExample[];

  /**
   * Search form
   * @type {UntypedFormGroup}
   */
  searchForm: UntypedFormGroup;

  /**
   * Results count
   * @type {number}
   */
  resultCount: number;

  /**
   * Determines if result preview visible
   * @type {boolean}
   */
  isResultPreviewVisible = false;

  /**
   * Current page
   * @type {number}
   */
  currentPage = 1;
  /**
   * Current lang
   * @type {string}
   */
  currentLang: string;
  /**
   * link for sparql result file
   * @type {string}
   */
  downloadUrl: string;
  /**
   * Cleanup subscriptions
   * @type {Subject<void>}
   */
  private destroy$: Subject<void> = new Subject<void>();
  /**
   * Editor setup timeout reference
   * @type {number}
   */
  private editorSetupTimeout: ReturnType<typeof setTimeout>;

  /**
   * @ignore
   */
  constructor(
    private readonly sparqlService: SparqlService,
    private readonly fb: UntypedFormBuilder,
    private readonly translateService: TranslateService,
    private readonly notificationsService: NotificationsService,
    private readonly ngZone: NgZone,
  ) {}

  /**
   * Initializes component
   */
  ngOnInit() {
    this.exampleQueriesForDane = this.sparqlService.getExamples('dane');
    this.exampleQueriesForKronika = this.sparqlService.getExamples('kronika');
    this.searchForm = this.fb.group({
      searchOption: ['dane'],
      editor: [''],
      format: ['application/rdf+xml'],
    });
    this.currentLang = this.translateService.currentLang.toLowerCase();

    this.notificationsService
      .getAlerts()
      .pipe(takeUntil(this.destroy$))
      .subscribe(() => {
        this.isResultPreviewVisible = false;
      });
  }

  /**
   * Cleanups
   */
  ngOnDestroy() {
    this.resultEditor?.destroy();
    this.resultEditor?.container.remove();
    this.destroy$.next();
    if (this.editorSetupTimeout) {
      clearTimeout(this.editorSetupTimeout);
    }
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
    this.sparqlService
      .search(
        this.searchForm.value.editor,
        this.searchForm.value.format,
        this.currentPage,
        this.searchForm.value.searchOption,
      )
      .pipe(takeUntil(this.destroy$))
      .subscribe((res) => {
        this.notificationsService.clearAlerts();
        this.resultCount = res.meta.count;
        this.isResultPreviewVisible = true;
        this.downloadUrl = res.data.attributes.download_url;
        this.editorSetupTimeout = setTimeout(() => {
          this.ngZone.runOutsideAngular(() => {
            this.resultEditor = ace.edit('sparqlResult');
            this.resultEditor.setReadOnly(true);
            this.resultEditor.setTheme('ace/theme/chrome');
            this.resultEditor.setSession(new EditSession(res.data.attributes.result));
            const modePath = this.getEditMode();
            this.resultEditor.session.setMode(modePath);
            this.resultEditor.session.setUseWorker(false);
            beautify(this.resultEditor.session);
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
   * Downloads result file
   */
  download() {
    window.open(this.downloadUrl, '_blank').focus();
  }

  /**
   * Returns the Ace mode ID for the selected data type
   * @returns {string} The mode path (e.g. 'ace/mode/xml')
   */
  private getEditMode(): string {
    switch (this.searchForm.value.format) {
      case 'application/rdf+xml':
      case 'application/sparql-results+xml':
        return 'ace/mode/xml';
      case 'application/sparql-results+json':
        return 'ace/mode/json';
      default:
        return 'ace/mode/text';
    }
  }
}
