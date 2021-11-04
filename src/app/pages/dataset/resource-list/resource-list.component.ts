import { Component, EventEmitter, Input, Output } from '@angular/core';
import { IDownloadFile } from '@app/services/models/download-item';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';

/**
 * Component to show dataset item results
 */
@Component({
    selector: 'app-resource-list',
    templateUrl: './resource-list.component.html'
})
export class ResourceListComponent {

    /**
     * Router endpoints of resource list component
     */
    routerEndpoints = RouterEndpoints;
    /**
     * resource items to display
     */
    @Input() items: any;

    /**
     * determines if created sort param is active
     */
    @Input() isSortParamsCreated = false;

    /**
     * determines if data date sort param is active
     */
    @Input() isSortParamsDataDate = false;

    /**
     * Event emitter for download event
     */
    @Output() download = new EventEmitter<IDownloadFile>();

    /**
     * triggers download event emitter
     * @param {IDownloadFile} file
     */
    onDownload(file: IDownloadFile) {
        this.download.emit(file);
    }
}
