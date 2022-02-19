import { Component, EventEmitter, Input, OnInit, Output } from '@angular/core';
import { WidgetAbstractComponent } from '@app/shared/cms/widget/widget.abstract.component';
import { IRawText } from '@app/services/models/cms/widgets/raw-text';
import { IRawTextObject } from '@app/services/models/cms/controls/raw-text/raw-text-object';
import { CmsService } from '@app/services/cms.service';
import { DomSanitizer } from '@angular/platform-browser';
import { EmbedRawTextService } from '@app/services/embed-raw-text.service';
import { WidgetType } from '@app/services/models/cms/widgets/widget-type';
import { FeatureFlagService } from '@app/services/feature-flag.service';

/**
 * Raw text
 */
@Component({
  selector: 'cms-raw-text',
  templateUrl: './raw-text.component.html',
})
export class RawTextComponent extends WidgetAbstractComponent implements OnInit {
  /**
   * Text to display
   */
  @Input() rawText: IRawText;

  /**
   * Is full width
   */
  @Input() isFullWidth = false;

  /**
   * Event emitter for loaded content
   */
  @Output() rawTextHasLoaded = new EventEmitter();

  /**
   * Widget type enum
   */
  readonly widgetType = WidgetType;

  /**
   * Extract text from html like element used to build link for hyper editor link widget
   */
  text: string;

  /**
   * Styles for text
   */
  style: any;

  /**
   * Raw text objects
   */
  rawTextObjects: IRawTextObject[] = [];

  classes: string;

  /**
   * @ignore
   */
  constructor(
    cmsService: CmsService,
    sanitizer: DomSanitizer,
    private embedRawTextService: EmbedRawTextService,
    private featureFlagService: FeatureFlagService,
  ) {
    super(cmsService, sanitizer);
  }

  /**
   * Prepare text with styles do display in html
   */
  ngOnInit() {
    this.rawTextHasLoaded.emit(true);
    this.rawTextObjects = this.embedRawTextService.changeTextToRawTextObjectList(
      this.rawText.settings ? this.rawText.settings.text : this.rawText.value,
    );
    this.style = this.cmsService.addStyle(this.rawText);
    if (this.rawText.settings && this.rawText.settings.url) {
      this.text = this.embedRawTextService.extractTextFromElement(this.rawText.settings.text);
    }

    if (this.featureFlagService.validateFlagSync('S44_footer_cms.fe')) {
      if (this.rawText.general?.classes) {
        this.classes = this.rawText.general.classes;
      }

      if (
        document.querySelector('a.page-footer__list-item.btn-write-us') &&
        document.querySelector('a.page-footer__list-item.btn-link-rodo')
      ) {
        this.cmsService.footerNavIsExist(true);
      }
    }
  }
}
