import { Component, Input } from '@angular/core';

/**
 * file size Component
 */
@Component({
    selector: 'app-file-size',
    templateUrl: './file-size.component.html'
})
export class FileSizeComponent {
    /**
     * file size
     */
    @Input() fileSize: number;
}
