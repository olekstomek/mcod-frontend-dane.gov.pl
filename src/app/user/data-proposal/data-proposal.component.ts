import { Component } from '@angular/core';

import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';
import { API_URL } from '@app/user/list-view/API_URL';
import { ApiConfig } from '@app/services/api';

/**
 * Data Proposal Component
 */
@Component({
    selector: 'app-data-proposal',
    templateUrl: './data-proposal.component.html',
    providers: [
        {provide: API_URL, useValue: ApiConfig.dataProposal }
    ]
})
export class DataProposalComponent {
    /**
     * @ignore
     */
    PermissionPerRoles: typeof PermissionPerRoles = PermissionPerRoles;
}
