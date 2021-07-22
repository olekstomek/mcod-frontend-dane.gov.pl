import {Component, Input} from '@angular/core';

import { DataProposalListItem } from '@app/user/data-proposal/list/DataProposalListItem';


/**
 * Data Proposal List Item Component
 */
@Component({
    selector: 'app-data-proposal-list-item',
    templateUrl: './data-proposal-list-item.component.html'
})
export class DataProposalListItemComponent {

    /**
     * List Item
     */
    @Input()
    listItem: DataProposalListItem;
}
