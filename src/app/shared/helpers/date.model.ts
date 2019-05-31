export class DateModel {
    private date: number;

    constructor(source: string = '') {
        this.date = source ? Date.parse(source) : Date.now();
    }

    format(format: string = ''): string {
        return new Date(this.date).toDateString();
    }
}
