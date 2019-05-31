import { Injectable } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { TranslateService } from '@ngx-translate/core';

import { StringHelper } from '@app/shared/helpers/string.helper';
import { APP_CONFIG } from '@app/app.config';

/**
 * Shared singleton service that handles every case of SEO
 */
@Injectable()
export class SeoService {

    private siteTitle: string;
    private siteSlogan: string;

    /**
     * @ignore
     */
    constructor(private titleService: Title,
                private metaService: Meta,
                private translate: TranslateService) {
        this.translate.get(['Description']).subscribe(data => {
            this.siteTitle = APP_CONFIG.name;
            this.siteSlogan = data['Description'];
            this.titleService.setTitle(this.siteTitle);
            this.metaService.addTag({ name: 'description', content: this.siteSlogan });
        });
        /*
        this.translate.onLangChange.subscribe((event: LangChangeEvent) => {
            // In case anything else should be changed
            console.log('SEO Translate change', event);
        });
        */
    }

    /**
     * Set page `<title>` tags
     * @param {string} titleString
     */
    public setPageTitle(titleString: string) {
        this.titleService.setTitle(titleString + ' - ' + this.siteTitle);
    }

    /**
     * Set page `meta description` tags
     * @param {string} pageDesc
     */
    public setPageDescription(pageDesc: string) {
        this.metaService.updateTag({ name: 'description', content: pageDesc });
    }

    /**
     * Set description from backend text. Strips html tags and limits text to 30 words
     * @param {string} text
     * @param {number} limitWords
     */
    public setDescriptionFromText(text: string, limitWords: number = 30) {
        const pageDesc = StringHelper.stripHtmlTags(text.split(' ').splice(0, limitWords).join(' ')) + '...';

        this.metaService.updateTag({ name: 'description', content: pageDesc });
    }

    /**
     * Set title and description based on language file for given page name
     * @param {string} pageName
     */
    public setSeoFromTranslation(pageName: string) {
        this.setSeoByKeys(`${pageName}.Self`, `${pageName}.Description`);
    }

    /**
     * Set title and description based on language file for given index keys
     * @param {string} titleKey Key for title tag
     * @param {string} descKey Key for description tag
     */
    public setSeoByKeys(titleKey?: string, descKey?: string) {
        this.translate.stream([titleKey, descKey]).subscribe(data => {

            this.siteTitle = APP_CONFIG.name;
            const pageTitle = !titleKey || data[titleKey] === titleKey ? false : data[titleKey];
            const pageDesc = !descKey || data[descKey] === descKey ? false : data[descKey];

            pageTitle ? this.titleService.setTitle(`${pageTitle} - ${this.siteTitle}`) : this.titleService.setTitle(this.siteTitle);

            pageDesc ? this.metaService.updateTag({ name: 'description', content: pageDesc }) : this.metaService.updateTag({ name: 'description', content: '' });
        });
    }

}
