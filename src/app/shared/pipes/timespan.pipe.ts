import {Pipe, PipeTransform} from '@angular/core';
import moment from 'moment';
import {TranslateService} from '@ngx-translate/core';

/**
 * Timespan Pipe
 * Indicates amount of time (timeago) from a specified timespan using current app language.
 * @example
 * {{ item.attributes.modified | timespan }}
 */
@Pipe({
    name: 'timespan',
    pure: true
})
export class TimespanPipe implements PipeTransform {

    /**
     * @ignore
     */
    constructor(private translate: TranslateService) {
    }

    /**
     * Transforms timespan pipe
     * @param {any} value
     * @param lang - by default is a currentLang from TranslateService
     * @returns {any}
     */
    transform(value: any, lang = this.translate.currentLang): any {
        moment.locale(lang);
        const _moment: moment.Moment = moment(value);
        return _moment.fromNow();
    }
}
