import { Component, Input } from '@angular/core';
import { ArrayHelper } from '@app/shared/helpers';

/**
 * Component which displays key words
 */
@Component({
    selector: 'app-keywords',
    templateUrl: './keywords.component.html'
})
export class KeywordsComponent {
    
    /**
     * Text representation of tags
     */
    text: string;

    /**
     * builds keywords string from all keywords
     * @param {string []} tags
     */
    @Input() set tags(tags: string[]) {
        this.text = ArrayHelper.convertArrayValuesToCommaSeparatedString(tags);
    }
}
