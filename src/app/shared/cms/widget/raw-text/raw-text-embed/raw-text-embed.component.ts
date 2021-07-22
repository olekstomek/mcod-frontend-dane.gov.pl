import {Component, Input} from '@angular/core';
import {IRawTextEmbed} from '@app/services/models/cms/controls/raw-text/raw-text-embed';
import {IRawTextEmbedType} from '@app/services/models/cms/controls/raw-text/raw-text-embed-type.enum';
import {IBanner} from '@app/services/models/cms/widgets/banner';
import {WidgetType} from '@app/services/models/cms/widgets/widget-type';
import {IVideo} from '@app/services/models/cms/widgets/video';

@Component({
    selector: 'raw-text-embed-object',
    templateUrl: './raw-text-embed.component.html'
})
export class RawTextEmbedComponent {

    @Input() embedObject: IRawTextEmbed;

    constructor() {
    }

    /**
     * Returns enums RawTestEmbedType.
     */
    public getEmbedType() {
        return IRawTextEmbedType;
    }


    public createBannerObject(): IBanner {
        return {
            type: WidgetType.BANNER,
            id: '',
            general: null,
            value: {
                image: +this.embedObject.id,
                alt: this.embedObject.alt,
                format: this.embedObject.format
            }
        };
    }

    public createVideoObject(): IVideo {
        return {
            type: WidgetType.VIDEO,
            id: '',
            general: null,
            value: {
                caption: null,
                video: this.embedObject.url
            }
        };
    }
}
