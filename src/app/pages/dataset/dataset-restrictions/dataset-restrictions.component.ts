import { Component, Input, OnInit } from '@angular/core';

import { toggleVertically } from '@app/animations/toggle-vertically';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { LicensesService } from '@app/services/licenses.service';
import { LicenseWithRules, ZeroLicense } from '../../../../../server/licenses/License';

/**
 * Dataset Restrictions Component
 */
@Component({
    selector: 'app-dataset-restrictions',
    templateUrl: './dataset-restrictions.component.html',
    providers: [LicensesService],
    animations: [
        toggleVertically
    ]
})
export class DatasetRestrictionsComponent implements OnInit {
    /**
     * Dataset
     */
    @Input() dataset: any;
    /**
     * Is content collapsible
     */
    @Input() isCollapsible = false;
    /**
     * Determines whether dataset has restrictions
     */
    hasRestrictions: boolean;
    /**
     * Current state - is expanded
     */
    isExpanded = true;

    /**
     * License
     * @type {ZeroLicense | LicenseWithRules}
     */
    license: ZeroLicense | LicenseWithRules;

    /**
     * @ignore
     */
    constructor(private readonly licensesService: LicensesService,
                private readonly featureFlagService: FeatureFlagService) {
    }

    /**
     * Expands container on init.
     * Checks whether provided dataset has restrictions
     * Gets license
     */
    ngOnInit(): void {
        if (this.isCollapsible) {
            this.isExpanded = false;
        }

        this.checkDatasetRestrictions();

        if (this.featureFlagService.validateFlagSync('S21_licenses.fe')) {
            this.licensesService
                .getLicense(this.dataset.attributes.license_name)
                .subscribe(res => {
                    this.license = res;
                });
        }
    }

    /**
     * Determines whether related dataset has restrictions
     */
    private checkDatasetRestrictions(): void {
        if (!this.dataset) {
            return;
        }

        this.hasRestrictions = this.dataset.attributes.license_condition_source ||
            this.dataset.attributes.license_condition_original ||
            this.dataset.attributes.license_condition_modification ||
            this.dataset.attributes.license_condition_responsibilities ||
            this.dataset.attributes.license_condition_db_or_copyrighted ||
            this.dataset.attributes.license_condition_personal_data;
    }
}
