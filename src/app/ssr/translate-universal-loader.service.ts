
import { TranslateLoader } from '@ngx-translate/core';
import { Observable, of } from 'rxjs';
const fs = require('fs');
const path = require('path');

/**
 * Translate Universal Loader
 */
export class TranslateUniversalLoader implements TranslateLoader {
    private prefix = 'i18n';
    private suffix = '.json';
    /**
     * Gets the translations from the server
     * @param lang
     * @returns {any}
     */
    public getTranslation(lang: string): Observable<any> {
        return of(JSON.parse(fs.readFileSync(path.join(__dirname, '..', `assets/${this.prefix}/${lang}${this.suffix}`), 'utf8')));
    }
}
