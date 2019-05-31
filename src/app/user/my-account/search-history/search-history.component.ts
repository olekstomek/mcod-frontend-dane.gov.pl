import { Component, OnInit } from '@angular/core';
import { SearchHistoryService } from '@app/services/search-history.service';
import { SearchHistory } from '@app/services/models/search-history';

/**
 * Search History Component
 */
@Component({
    templateUrl: './search-history.component.html'
})
export class SearchHistoryComponent implements OnInit {

    /**
     * Iterable object with dates as keys
     * @type {SearchHistory}
     */
    searchHistory: SearchHistory = new SearchHistory();
    /**
     * @ignore
     */
    constructor(private service: SearchHistoryService) {
    }

    /**
     * Get data from backend
     */
    ngOnInit(): void {
        this.service.getSearchHistory().subscribe(data => {
            this.searchHistory = data;
        });
    }
}
