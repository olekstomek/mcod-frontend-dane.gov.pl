import { Injectable } from '@angular/core';
import { Observable, BehaviorSubject } from 'rxjs';

import { Alert } from '@app/services/models/alert';

/**
 * Global Notifications Service that handles displaying alert messages
 */
@Injectable()
export class NotificationsService {

    private alertsArray: Alert[];
    private alertsSource = new BehaviorSubject<Alert[]>([]);
    private readonly alerts = this.alertsSource.asObservable();

    /**
     * Initialize empty list of alerts and push initial notification with empty arry
     */
    constructor() {
        this.alertsArray = [];
        this.alertsSource.next(this.alertsArray);
    }

    /**
     * Shortcut for new success message
     * @param {string} text
     */
    public addSuccess(text: string) {
        this.addAlert('success', text);
    }

    /**
     * Shortcut for new error message
     * @param {string} text
     */
    public addError(text: string) {
        this.addAlert('danger', text);
    }

    /**
     * Add new message to alert stack
     * @param {string} type
     * @param {string} msg
     */
    public addAlert(type: string, msg: string) {
        this.alertsArray.push(<Alert>{type: type, msg: msg});
        this.alertsSource.next(this.alertsArray);
    }

    /**
     * Remove message from stack with specific index
     * @param {number} index
     */
    public removeAlertAtIndex(index: number) {
        this.alertsArray.splice(index, 1);
        this.alertsSource.next(this.alertsArray);
    }

    /**
     * Clear all messages
     */
    public clearAlerts() {
        this.alertsArray = [];
        this.alertsSource.next(this.alertsArray);
    }

    /**
     * Get observable object that returns list of active alerts
     * @returns {Observable<Alert[]>}
     */
    public getAlerts(): Observable<Alert[]> {
        return this.alerts;
    }

}
