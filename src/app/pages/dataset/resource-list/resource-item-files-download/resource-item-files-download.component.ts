import { Component, Output, EventEmitter, Input, OnInit } from '@angular/core';
import { IDatasetFile } from '@app/services/models/dataset-resource';
import { IDownloadFile } from '@app/services/models/download-item';

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

  constructor() {}

  ngOnInit() {
    this.downloadFilesList = this.item.attributes?.files;
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
