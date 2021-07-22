import { DOCUMENT } from '@angular/common';
import { Inject, Injectable } from '@angular/core';

/**
 * Apm Config service
 */
@Injectable({
    providedIn: 'root'
})
export class ApmConfigService {

    /**
     * Hostname
     * @type {string}
     */
    private readonly hostname: string;

    /**
     * @ignore
     */
    constructor(@Inject(DOCUMENT) private readonly document: Document) {
        this.hostname = this.document.location.hostname;
    }

    /**
     * Returns service name for Apm
     * @returns {string}
     */
    getServiceName(): string | null {
        let env = '';
        switch (this.hostname) {
            case 'int.dane.gov.pl':
                env += 'int';
                break;
            case 'dev.dane.gov.pl':
                env += 'dev';
                break;
            case 'szkolenia.dane.gov.pl':
                env += 'preprod';
                break;
            case 'dane.gov.pl':
                env += 'prod';
                break;
            default:
                env = null;
        }
        if (!!env) {
            env += '-frontend';
        }
        return env;
    }

    /**
     * Returns if Apm error handler should be enabled
     * @returns {boolean}
     */
    isApmErrorHandlerEnabled(): boolean {
        return this.getServiceName() && this.getServiceName().includes('prod');
    }
}
