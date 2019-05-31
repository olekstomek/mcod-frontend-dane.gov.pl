import moment from 'moment';

import { ArrayHelper, LinkHelper } from '@app/shared/helpers';

/**
 * Search history decorator model.
 * Creates Iterable object that can be used in templates
 * @example
 * const data = [{modified: '2018-02-12T12:10:45Z', ...}]
 * const history = new SearchHistory(data) // result: {'2018.02.12': [{...}, {...}]}
 * <div *ngFor="let group of history"><ul><li *ngFor="let item of group">{{ item }}</li></ul></div>
 * <div *ngFor="let key of history.keys()">{{ key }}<ul><li *ngFor="let item of history[key]">{{ item }}</li></ul></div>
 */
export class SearchHistory implements Iterable<any> {
    private _length: number;
    private _keys: string[];

    /**
     * Creates keys and decorates itself with the result
     * @param {any[]} historyItems
     * @returns {this}
     */
    constructor(historyItems = []) {
        const regex = /.*\/(\w*)/;

        historyItems.map(item => {
            item.queryString = item.attributes.url.split('?')[1];
            item.resource = regex.exec(item.attributes.url)[1];
            if (item.resource.endsWith('s')) {
                item.resource = item.resource.substring(0, item.resource.length - 1);
            }
            item.params = LinkHelper.parseQueryString(item.queryString);

            Object.keys(item.params).map(key => {
                item.params[key] = String(item.params[key]).replace('|', ',');
                if (key.indexOf('__in') > -1) {
                    const newkey = String(key).replace('__in', '');
                    item.params[newkey] = item.params[key];
                    delete item.params[key];
                }
            });
        });

        historyItems = ArrayHelper.groupBy(historyItems, item => {
            return moment(item.attributes.modified).format('YYYY.MM.DD');
        });

        this._keys = Object.keys(historyItems).sort().reverse();
        this._length = this._keys.length;

        Object.assign(this, historyItems);
        return this;
    }

    /**
     * Returns the number of groups in Iterable
     * @returns {number}
     */
    get length(): number {
        return this._length;
    }

    /**
     * Returns list of keys as array of strings
     * @returns {string[]}
     */
    public keys() {
        return this._keys;
    }

    /**
     * Required by interface, allows *ngFor directive to iterate through groups
     * @returns {Iterator<SearchHistory>}
     */
    [Symbol.iterator](): Iterator<SearchHistory> {
        let index = 0;
        return {
            next: () => {
                const key = this._keys[index];
                const value = this[key];
                const done = index >= this._keys.length;
                index++;
                return {value, done};
            }
        };
    }
}
