import { Injectable } from '@angular/core';
import { IAggregationProperties, MultiselectOption } from '@app/services/models/filters';

@Injectable({
    providedIn: 'root'
})

export class MultiselectFilterService {

    /**
     * Returns new multiselect data
     * @param {MultiselectOption } selectedIds
     * @param {Option } selectedOption
     * @return {MultiselectOption}
     */
    changeMultiselect(selectedIds: MultiselectOption, selectedOption: IAggregationProperties): MultiselectOption {
        const filterGroup: MultiselectOption = Object.assign({}, selectedIds);

        if (filterGroup[selectedOption.id]) {
            delete filterGroup[selectedOption.id];
        } else {
            filterGroup[selectedOption.id] = selectedOption;
        }

        return filterGroup;
    }

    /**
     * check if filter has changed
     * @param {MultiselectOption } changedData
     * @param {MultiselectOption } initialData
     * @return {boolean}
     */
    getAvailability(changedData: MultiselectOption, initialData: MultiselectOption): boolean {
        if (!initialData) {
            const keys = Object.keys(changedData).length;
            return !!keys;
        }

        const changedKeys = Object.keys(changedData);
        const initialKeys = Object.keys(initialData);

        if (changedKeys.length !== initialKeys.length) {
            return true;
        }

        let isDifferent = false;

        changedKeys.forEach((changedKey: string) => {
            if (!initialKeys.includes(changedKey)) {
                isDifferent = true;
            }
        });

        return isDifferent;
    }

}
