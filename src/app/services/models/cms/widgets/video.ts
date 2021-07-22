import {IWidget} from '@app/services/models/cms/widgets/widget';
import {ISettings} from '@app/services/models/cms/controls/settings';

export interface IVideo extends IWidget {
    value: {
        caption: string;
        video: string;
    };
}

export interface IVideoHyperEditor extends IWidget {
    general: any;
    settings: ISettings;
}
