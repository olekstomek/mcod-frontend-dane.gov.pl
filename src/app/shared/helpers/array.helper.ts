/**
 * Array Helper modules
 * Replacement for underscore and lodash functions
 */
export class ArrayHelper {

    /**
     * Groups items by specified key. Key also might be a function, that parses items
     * @param {any[]} collection
     * @param {string | Function} key
     * @returns {any}
     *
     * @example
     * const items = [{name: '', surname: 'Anderson'},...]
     * ArrayHelper.groupBy(items, 'surname') // result: {'Anderson': {...}}
     * ArrayHelper.groupBy(items, item => item.surname.toLowerCase()); // result: {'anderson': {...}}
     */
    static groupBy(collection: any[], key: string | Function) {
        return collection.reduce((result, item) =>  {
            const v = key instanceof Function ? key(item) : item[key];
            (result[v] = result[v] || []).push(item);
            return result;
        }, {});
    }
}
