import { ModuleWithProviders, NgModule, Optional, SkipSelf } from '@angular/core';
import { CommonModule } from '@angular/common';

import { DatasetService } from '@app/services/dataset.service';
import { UserService } from '@app/services/user.service';
import { AboutService } from '@app/services/about.service';
import { NotificationsService } from '@app/services/notifications.service';
import { ApplicationsService } from '@app/services/applications.service';
import { SeoService } from '@app/services/seo.service';
import { ArticlesService } from '@app/services/articles.service';
import { InstitutionsService } from '@app/services/institutions.service';
import { AbstractService } from '@app/services/abstract.service';
import { ObserveService } from '@app/services/observe.service';
import { SearchHistoryService } from '@app/services/search-history.service';

/**
 * Global Service Module that imports all services
 */
@NgModule({
    imports: [
        CommonModule
    ],
    providers: [
        NotificationsService,
        DatasetService,
        ApplicationsService,
        ArticlesService,
        InstitutionsService,
        UserService,
        AboutService,
        ApplicationsService,
        AbstractService,
        SeoService,
        SearchHistoryService,
        ObserveService
    ]
})
export class ServicesModule {
    constructor(@Optional() @SkipSelf() parentModule: ServicesModule) {
        if (parentModule) {
            throw new Error(
                'ServicesModule is already loaded. Import it in the AppModule only');
        }
    }

    static forRoot(): ModuleWithProviders {
        return {
            ngModule: ServicesModule,
            providers: [
                NotificationsService,
                DatasetService,
                ApplicationsService,
                InstitutionsService,
                UserService,
                ArticlesService,
                ApplicationsService,
                AbstractService,
                SeoService,
                ObserveService
            ]
        };
    }
}
