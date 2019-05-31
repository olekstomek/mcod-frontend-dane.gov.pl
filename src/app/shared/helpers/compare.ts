import * as moment from 'moment';

/**
 * Comparison helper.
 * Checks different types of value, against search phrase
 */
export class Compare {

    /**
     * Checks if a given value in `value` matches with `filterExpression`
     *
     * @example
     * Compare.comparisonFilter(50, \'\> 45\')
     *
     * @param {number | string} value
     * @param {string} filterExpression
     * @returns {boolean}
     */
    static comparisonFilter(value: number | string, filterExpression: string): boolean {
        if (typeof value === 'number' || !isNaN(+value)) {

            // TODO: XOR
            switch (true) {
                case filterExpression.indexOf('>=') !== -1:
                    const f = +(filterExpression.substring(filterExpression.indexOf('>=') + 2).trim());
                    return +value >= f;
                case filterExpression.indexOf('<=') !== -1:
                    const g = +(filterExpression.substring(filterExpression.indexOf('<=') + 2).trim());
                    return +value <= g;
                case filterExpression.indexOf('>') !== -1:
                    const x = +(filterExpression.substring(filterExpression.indexOf('>') + 1).trim());
                    return +value > x;
                case filterExpression.indexOf('<') !== -1:
                    const y = +(filterExpression.substring(filterExpression.indexOf('<') + 1).trim());
                    return +value < y;
                default:
                    return value.toString().indexOf(filterExpression.toLowerCase()) !== -1;
            }
        }
        if (typeof value !== 'number') {
            return value.toString().toLowerCase().indexOf(filterExpression.toLowerCase()) !== -1;
        }
        return true;
    }
}
