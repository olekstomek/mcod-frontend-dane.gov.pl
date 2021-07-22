import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { environment } from '@env/environment';
import { TranslateService } from '@ngx-translate/core';
import { defer, Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';
import { LicenseWithRules, ZeroLicense } from '../../../server/licenses/License';

import { StringHelper } from '@app/shared/helpers/string.helper';

@Injectable()
export class LicensesService {

    /**
     * @ignore
     */
    constructor(private readonly http: HttpClient,
                private readonly translate: TranslateService) {
    }

    /**
     * Gets license from SSR API because of performance
     * @param licenseName
     * @returns {Observable<ZeroLicense | LicenseWithRules> | Observable<LicenseWithRules | ZeroLicense>}
     */
    getLicense(licenseName: string): Observable<ZeroLicense | LicenseWithRules> {
        if (!environment.production) {
            return this.getMockLicense(licenseName);
        }

        let headers = new HttpHeaders();
        headers = headers.append('Accept-Language', this.translate.currentLang);
        return this.http.get<LicenseWithRules | ZeroLicense>(`/api/license/${encodeURIComponent(licenseName)}`, {headers});
    }

    /**
     * Gets licenses at local environment
     * @param licenseName
     * @returns {Observable<LicenseWithRules | ZeroLicense>}
     */
    private getMockLicense(licenseName: string): Observable<ZeroLicense | LicenseWithRules> {
        return defer(() => import('../../../server/licenses/licenses'))
            .pipe(map(res => res.LICENSES[this.translate.currentLang.toUpperCase()][StringHelper.
            trimEndAndRemoveSpaces(licenseName, 4)]));
    }

}
