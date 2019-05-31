import { Component, OnInit } from '@angular/core';

import { SeoService } from '@app/services/seo.service';
import { ArticlesService } from '@app/services/articles.service';

/**
 * Knowledge Base Tab Faq Component
 */
@Component({
    selector: 'app-knowledge-base-tab-faq',
    templateUrl: './knowledge-base-tab-faq.component.html'
})
export class KnowledgeBaseTabFaqComponent  implements OnInit {

    /**
     * Article of knowledge base tab faq component
     */
    article;

    /**
     * @ignore
     */
    constructor(private seoService: SeoService,
                private articleService: ArticlesService) {
    }

    /**
     * Sets META tags (title). 
     * Initializes faq page from an article.
     */
    ngOnInit() {
        this.seoService.setSeoByKeys('KnowledgeBase.Faq');

        this.articleService
            .getAll({per_page: 1, category: 4})
            .subscribe(response => {
                if (response.results && !response.results.length) return;

                this.article = response.results[0];
            }
        );
    }
}
