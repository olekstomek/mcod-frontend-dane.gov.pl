/**
 * Sorting class. Requires initialization
 * @constructor
 */
export class Sorter {
    /**
     * Direction of sorting. Default 1 = Ascending, -1 = Descending
     */
    direction: number;
    /**
     * Key which data should be sorted by
     */
    key: string;

    constructor() {
        this.direction = 1;
    }

    /**
     * Sorts data by specific key. If the same key is provided, the direction is changed.
     * @param key
     * @param data
     * @param preserveDirection
     * @returns data {any}
     */
    sort(key, data, preserveDirection: boolean = false) {

        if (!preserveDirection) {
            this.direction = (this.key === key) ? this.direction * -1 : this.direction = 1;
        }

        this.key = key;

        data.sort((a, b) => {
            const x = !isNaN(+a[key]) ? +a[key] : a[key];
            const y = !isNaN(+b[key]) ? +b[key] : b[key];

            if (x === y) {
                return 0;
            } else if (x > y) {
                return this.direction;
            } else {
                return -1 * this.direction;
            }
        });
        
        return data;
    }
}
