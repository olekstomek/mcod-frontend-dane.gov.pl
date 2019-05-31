export class DateHelper {

    static unix() {
        return Math.round((new Date()).getTime() / 1000);
    }
}
