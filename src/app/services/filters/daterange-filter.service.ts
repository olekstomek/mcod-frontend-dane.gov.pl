import { Injectable } from '@angular/core';
import { DaterangeFilterAvailability, DaterangeFilterUpdated, DaterangeFilterModel } from '@app/services/models/filters';
import moment from 'moment';

@Injectable({
    providedIn: 'root'
})

export class DaterangeFilterService {

    /**
     * Returns new daterange data
     * @param {BasicPageParams } dates
     * @return {DaterangeFilterModel}
     */
    changeDaterange(dates: DaterangeFilterUpdated []): DaterangeFilterModel {
        const dateModel: DaterangeFilterModel = {};
        dates.forEach((date: DaterangeFilterUpdated) => {
            dateModel[date.name] = date.value ? new Date(date.value) : null;
        });

        return dateModel;
    }

    /**
     * Returns new availibilty after filter change
     * @param {DaterangeFilterModel } changedData
     * @param {DaterangeFilterModel } initialData
     * @return {DaterangeFilterAvailability}
     */
    getAvailability(changedData: DaterangeFilterModel, initialData: DaterangeFilterModel): DaterangeFilterAvailability {
        const keys: string [] = Object.keys(changedData);
        const returnData: DaterangeFilterAvailability = {};

        keys.forEach((key: string) => {
            if (!changedData[key] && !initialData[key]) {
                returnData[key] = false;
            } else {
                returnData[key] = !moment(changedData[key]).isSame(initialData[key], 'day');
            }
        });

        return returnData;
    }
}
