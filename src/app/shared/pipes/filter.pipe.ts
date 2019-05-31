import { Pipe, PipeTransform } from '@angular/core';

/**
 * Filter Pipe
 * Performs filtering on a list of items
 * @example
 * <li *ngFor="let row of rows | filter:searchKeys:searchTerm"></li>
 */
@Pipe({
    name: 'filter',
    pure: false
})
export class FilterPipe implements PipeTransform {

    /**
     * Transforms input
     * @param {any[]} items 
     * @param {string | string[]} filterBy 
     * @param {term: string} term 
     * @returns {any} 
     */
    transform(items: any[], filterBy: string | string[], term: string): any {

        // no search term
        if (!term) return items;

        if (!filterBy) {
            return (items.length > 0)
                ? items.filter(item => item.toString().toLowerCase().indexOf(term.toLowerCase()) !== -1)
                : items;
        }

        if (typeof filterBy === 'string') {
            return (items.length > 0 && filterBy)
                ? items.filter(item => item[filterBy].toString().toLowerCase().indexOf(term.toLowerCase()) !== -1)
                : items;
        }

        if (typeof filterBy !== 'string') {
            if (items.length > 0 && filterBy.length > 0) {

                return items.filter(item => {
                    for (const key of filterBy) {
                        if (item[key] && item[key].toString().toLowerCase().indexOf(term.toLowerCase()) !== -1) {
                            return true;
                        }
                    }
                    return false;
                });
            }
        }

        return items;
    }
}
