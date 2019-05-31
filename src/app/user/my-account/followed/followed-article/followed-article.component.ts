import { Component, OnInit } from '@angular/core';

import { NotificationsService } from '@app/services/notifications.service';
import { ArticlesService } from '@app/services/articles.service';

/**
 * Followed Article Component
 */
@Component({
    selector: 'app-followed-article',
    templateUrl: './followed-article.component.html'
})
export class FollowedArticleComponent implements OnInit {
    /**
     * Default params of followed article component
     */
    params: any = {
        per_page: 5,
        page: 1,
        sort: '-modified'
    };

    /**
     * Array of items (followed articles)
     */
    items: any[];

    /**
     * Count of items (followed articles)
     */
    count: number;

    /**
     * @ignore
     */
    constructor(private articlesService: ArticlesService,
            private notificationsService: NotificationsService) { 
    }
    
    /**
     * Initializes list of items (applications) on component init
     */
    ngOnInit() {
        this.initItems();
    }

    /**
     * Initializes list of items (articles)
     */
    initItems() {
        this.articlesService.getFollowed(this.params)
            .subscribe(data => {
                this.items = data.data;
                this.count = data.meta.count;
            });
    }

    /**
     * Stop following changes of dataset with given id
     * Only logged in users
     * @param {string} id
     * @returns {Observable<any>}
     */
    unfollowItem(item) {
        this.articlesService.unfollowOne(item.id)
            .subscribe(() => {
                setTimeout( () => {
                    this.initItems();
                }, 1000);
            }, error => {
                if (error.message) {
                    this.notificationsService.addError(error.message);
                }
            });
    }

    /**
     * Updates query params and items (articles) on every user interaction
     * @param {any} params 
     */
    updateParams(params: any) {
        this.params = Object.assign(this.params, params);
        this.initItems();
    }

    /**
     * Tracks list of items by single item id to prevent re-rendering of existing elements in the template
     * @param index 
     * @param item 
     * @returns id 
     */
    trackById(index, item) {
        return item.id;
    }
}
