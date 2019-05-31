import { Pipe, PipeTransform } from '@angular/core';
import moment from 'moment';

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
    constructor() {
    }

    /**
     * Transforms timespan pipe
     * @param {any} value
     * @param lang
     * @returns {any}
     */
    transform(value: any, lang: string): any {
        // TODO: Custom DateTime timespan helper
        moment.locale(lang);
        const _moment: moment.Moment = moment(value);
        return _moment.fromNow();
    }
}
