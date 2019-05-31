import { Component, OnInit } from '@angular/core';

import { SeoService } from '@app/services/seo.service';
import { ArticlesService } from '@app/services/articles.service';


/**
 * About Component
 */
@Component({
    selector: 'app-about',
    templateUrl: './about.component.html'
})
export class AboutComponent implements OnInit {

    /**
     * Article of about component
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
     * Initializes about page from an article.
     */
    ngOnInit() {
        this.seoService.setSeoFromTranslation('About');

        this.articleService
            .getAll({per_page: 1, category: 5})
            .subscribe(response => {
                if (response.results && !response.results.length) return;

                this.article = response.results[0];
            }
        );
    }
}
