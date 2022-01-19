import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { IDatasetFile } from '@app/services/models/dataset-resource';
import { IDownloadFile } from '@app/services/models/download-item';
import { FeatureFlagService } from '@app/services/feature-flag.service';

@Component({
  selector: 'app-resource-item-files-download',
  templateUrl: './resource-item-files-download.component.html',
})
export class ResourceItemFilesDownloadComponent implements OnInit {
  /**
   * array with data which will be displayed
   */
  @Input() item: any;
  /**
   * key to translation
   */
  @Input() titleTranslationKey: string;
  /**
   * enable/disable displaying each detail {key: value} in one row
   */
  @Input() showEachDetailInRow = false;

  /**
   * Event emitter for download event
   */
  @Output() download = new EventEmitter<IDownloadFile>();
  /**
   * list of files to download
   */
  downloadFilesList: IDatasetFile[];

  constructor(private featureFlagService: FeatureFlagService) {}

  ngOnInit() {
    if (this.featureFlagService.validateFlagSync('S41_opennes_score_in_tooltip.fe')) {
      this.downloadFilesList = this.item.attributes?.files;
    }
  }

  /**
   * triggers download event emitter
   * @param {string} title
   * @param {string} url
   */
  onDownload(title: string, url: string) {
    this.download.emit({ title: title, url: url });
  }
}
