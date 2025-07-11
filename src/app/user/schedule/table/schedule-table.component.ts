import { Component, EventEmitter, Input, OnInit, Output, TemplateRef, ViewChild } from '@angular/core';

import { PermissionPerRoles } from '@app/shared/user-permissions/PermissionPerRoles';
import { Role } from '@app/shared/user-permissions/Role';
import { ColumnDefinition } from '@app/user/schedule/table/domain/column.definition';
import { ScheduleTableConfig } from '@app/user/schedule/table/domain/schedule-table.config';
import { Schedule, ScheduleSettings, UserSchedule } from '@app/user/schedule/tabs/planning/domain/schedule';

/**
 * Schedule Table Component
 */
@Component({
    selector: 'app-schedule-table',
    templateUrl: './schedule-table.component.html',
})
export class ScheduleTableComponent implements OnInit {

    /**
     * Data source
     * @type {Schedule | UserSchedule}
     */
    @Input()
    dataSource: Schedule | UserSchedule;

    /**
     * Columns definition
     * @type {Array<ColumnDefinition>}
     */
    @Input()
    columns: Array<ColumnDefinition>;

    /**
     * Table Config
     * @type {ScheduleTableConfig}
     */
    @Input()
    config: ScheduleTableConfig;

    /**
     * Item to delete id
     * @type {string}
     */
    @Input()
    itemToDelete: string;

    /**
     * Delete item
     * @type {EventEmitter<string>}
     */
    @Output('deleteItem')
    deleteItemEmitter: EventEmitter<string> = new EventEmitter<string>();

    @Output()
    scheduleSettingsUpdated: EventEmitter<ScheduleSettings> = new EventEmitter<ScheduleSettings>();

    /**
     * Confirmation modal template refernece
     * @type {TemplateRef<any>}
     */
    @ViewChild('confirmationModalRef', {static: true})
    modalTemplate: TemplateRef<any>;

    /**
     * @ignore
     */
    Role: typeof Role = Role;

    /**
     * Table ready flag
     * @type {boolean}
     */
    isReady: boolean;

    /**
     * @ignore
     */
    PermissionPerRoles: typeof PermissionPerRoles = PermissionPerRoles;

    /**
     * Determines hovered row index number
     */
    hoveredRowIndex = -1;
    
    /**
     * Checks if config provided
     */
    ngOnInit(): void {
        if (!this.config) {
            return;
        }
        this.isReady = true;
    }

    /**
     * Show delete confirmation dialog
     * @param id
     */
    showDeleteConfirmation(id: string) {
        this.itemToDelete = id;
    }

    /**
     * Deletes item
     * @param itemId
     */
    deleteItem(itemId: string): void {
        this.deleteItemEmitter.emit(itemId);
    }

    /**
     * Closes dialog
     */
    closeDialog(): void {
        this.itemToDelete = '';
    }

    /**
     * Emits event when schedule settings was updated
     * @param settings
     */
    onScheduleSettingsUpdated(settings: ScheduleSettings): void {
        this.scheduleSettingsUpdated.next(settings);
    }
    
    /**
     * View mouse leave event, clears focus
     */
    onMouseLeave() {
        this.hoveredRowIndex = -1;
    }
}

