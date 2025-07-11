import {Component, Input, OnInit} from '@angular/core';

import {LabListItem} from '@app/user/lab/lab-list/LabListItem';


/**
 * Lab List Component
 */
@Component({
    selector: 'app-lab-list-item',
    templateUrl: './lab-list-item.component.html'
})
export class LabListItemComponent implements OnInit {

    /**
     * List Item
     */
    @Input()
    listItem: LabListItem;

    /**
     * Determines if count of file reports is more then one
     */
    isMoreThenOneFileReport: boolean;

    /**
     * Adds file counter to reports
     * Sets counter visibility
     */
    ngOnInit() {
        this.addCountToFileReports();
    }

    /**
     * Adds file counter to reports
     * Sets counter visibility
     */
    private addCountToFileReports(): void {
        let fileCounter = 0;
        this.listItem = {
            ...this.listItem, attributes: {
                ...this.listItem.attributes, reports: this.listItem.attributes.reports
                    .map(report => {
                        if (report.type === 'file') {
                            fileCounter = fileCounter + 1;
                            if (fileCounter === 2) {
                                this.isMoreThenOneFileReport = true;
                            }
                            return {...report, count: fileCounter};
                        }
                        return report;
                    })
            }
        };
    }
}
