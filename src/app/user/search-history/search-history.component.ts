import { Component, OnInit } from '@angular/core';

import { GroupedSearchHistory, SearchHistoryService } from '@app/services/search-history.service';
import { SeoService } from '@app/services/seo.service';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { SearchHistory } from '@app/services/models/search-history';

/**
 * Search History Component
 */
@Component({
    templateUrl: './search-history.component.html'
})
export class SearchHistoryComponent implements OnInit {

    /**
     * Router endpoints
     */
    routerEndpoints = RouterEndpoints;

    /**
     * Iterable object with dates as keys
     * @type {SearchHistory}
     */
    searchHistory: SearchHistory = new SearchHistory();
    
    /**
     * Grouped search history
     */
    groupedSearchHistory: GroupedSearchHistory;

    /**
     * @ignore
     */
    constructor(private seoService: SeoService,
                private service: SearchHistoryService) {
    }

    /**
     * Get data from backend
     */
    ngOnInit(): void {
        this.seoService.setPageTitleByTranslationKey(['User.SearchHistory', 'MyDashboard.Self']);

        // before S22_search_history.fe
        this.service.getSearchHistory().subscribe(data => {
            this.searchHistory = data;
        });
        
        // after S22_search_history.fe
        this.service.getGroupedSearchHistory().subscribe(data => {
            this.groupedSearchHistory = data;
        });
    }
}
