import { Component, Input } from '@angular/core';

@Component({
    selector: 'app-article-results',
    templateUrl: './article-results.component.html'
})
export class ArticleResultsComponent {
    @Input() items: any;
}
