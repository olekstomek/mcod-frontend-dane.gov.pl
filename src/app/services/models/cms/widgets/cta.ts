import {IWidget} from '@app/services/models/cms/widgets/widget';
import {IText} from '@app/services/models/cms/controls/text';
import {IBackgroundImage} from '@app/services/models/cms/controls/background-image';
import {IImage} from '@app/services/models/cms/controls/image';
import {IButton} from '@app/services/models/cms/controls/button';

export interface ICta extends IWidget {
    value: {
        background: IBackgroundImage;
        button: IButton;
        header: IText;
        image: IImage;
        text: IText;
    };
}
