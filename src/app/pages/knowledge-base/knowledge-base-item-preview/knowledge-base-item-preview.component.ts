import { ActivatedRoute } from '@angular/router';
import { Component, OnInit } from '@angular/core';

import { SeoService } from '@app/services/seo.service';
import { StringHelper } from '@app/shared/helpers/string.helper';

/**
 * Knowledge Base Item Preview Component
 */
@Component({
    selector: 'app-knowledge-base-item-preview',
    templateUrl: './knowledge-base-item-preview.component.html'
})
export class KnowledgeBaseItemPreviewComponent implements OnInit {

    /**
     * Article of article item component
     */
    article;

    /**
     * @ignore
     */
    constructor(private activatedRoute: ActivatedRoute,
                private seoService: SeoService) {
    }

    /**
     * Sets META tags (title, description). 
     * Initializes article.
     */
    ngOnInit() {
        this.article = this.activatedRoute.snapshot.data.post;
        this.article.attributes.tags = this.article.attributes.tags.join(', ');

        this.seoService.setPageTitle(this.article.attributes.title);
        this.seoService.setDescriptionFromText(StringHelper.stripHtmlTags(this.article.attributes.notes));
    }
}
