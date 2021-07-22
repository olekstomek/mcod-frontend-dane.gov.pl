import { Controller, Get, Headers, HttpException, HttpStatus, Param } from '@nestjs/common';
import { LicenseWithRules, ZeroLicense } from './License';
import { LICENSES } from './licenses';

import { StringHelper } from '@app/shared/helpers/string.helper';

/**
 * Licenses Controller
 * License Api
 */
@Controller('api/license')
export class LicensesController {

    /**
     * Gets licensed for requested id
     * @param licenseId
     * @param lang
     * @returns {LicenseWithRules | ZeroLicense}
     */
    @Get(':id')
    getLicense(@Param('id') licenseId: string, @Headers('Accept-Language') lang: string): LicenseWithRules | ZeroLicense {
        const allowedIds = ['CC0 1.0', 'CC BY 4.0', 'CC BY-SA 4.0', 'CC BY-NC 4.0', 'CC BY-NC-SA 4.0', 'CC BY-ND 4.0', 'CC BY-NC-ND 4.0'];
        if (allowedIds.indexOf(licenseId.trim()) === -1) {
            throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        }

        const allowedLanguages = ['PL', 'EN'];
        if (!!!lang || (!!lang && allowedLanguages.indexOf(lang.toUpperCase()) === -1)) {
            throw new HttpException('Bad request', HttpStatus.BAD_REQUEST);
        }
        const upperCaseLang = lang.toUpperCase();

        const license = LICENSES[upperCaseLang][StringHelper.trimEndAndRemoveSpaces(licenseId, 4)];
        if (!!!license) {
            throw new HttpException('Internal server error', HttpStatus.INTERNAL_SERVER_ERROR);
        }
        return license;
    }
}
