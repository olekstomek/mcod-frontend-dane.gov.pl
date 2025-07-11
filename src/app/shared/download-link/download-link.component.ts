import { Component, Input } from '@angular/core';

/**
 * download link Component
 */
@Component({
    selector: 'app-download-link',
    templateUrl: './download-link.component.html'
})
export class DownloadLinkComponent {
    /**
     * title
     */
    @Input() title: string;

    /**
     * file size
     */
    @Input() fileSize: number;

    /**
     * file format
     */
    @Input() format: string;

    /**
     * file url to download
     */
    @Input() fileUrl: string;

    /**
     * show download text
     */
    @Input() showDownloadText = false;

    /**
     * custom css class for styling
     */
    @Input() customCssClass: string;

    /**
     * show star rating data openness
     */
    @Input() opennessScore: number;
}
