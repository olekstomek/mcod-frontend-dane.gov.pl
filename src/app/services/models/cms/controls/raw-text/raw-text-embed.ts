import {IRawTextObject} from '@app/services/models/cms/controls/raw-text/raw-text-object';
import {IRawTextEmbedType} from '@app/services/models/cms/controls/raw-text/raw-text-embed-type.enum';

export interface IRawTextEmbed extends IRawTextObject {
    alt: string;
    embedType?: string;
    format?: string;
    id?: string;
    url?: string;
}
