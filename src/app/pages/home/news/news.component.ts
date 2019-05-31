import { Component, OnInit } from '@angular/core';
import { Subscription } from 'rxjs';

import { ArticlesService } from '@app/services/articles.service';
import { NotificationsService } from '@app/services/notifications.service';

/**
 * News Component
 */
@Component({
	selector: 'home-news',
	templateUrl: './news.component.html',
    providers: [NotificationsService]
})
export class NewsComponent implements OnInit {
    /**
     * Articles substription of news component
     */
    articlesSubstription: Subscription;

    /**
     * Items (articles) of news component
     */
    items;

    /**
     * @ignore
     */
    constructor(private articlesService: ArticlesService,
                private notificationsService: NotificationsService) {
    }

    /**
     * Initializes list of items (articles from one category - news).
     */
	ngOnInit() {
        this.articlesSubstription = this.articlesService
            .getAll({per_page: 3, sort: '-created', category: 1})
            .subscribe(
                news => this.items = news.results,
                error => {
                    if (error.message)
                        this.notificationsService.addError(error.message)
                    if (error.description)
                        this.notificationsService.addError(error.description)
                }
        );
    }

    /**
     * Unsubscribes from existing subscriptions
     */
    ngOnDestroy() {
        this.articlesSubstription.unsubscribe();
    }
}
