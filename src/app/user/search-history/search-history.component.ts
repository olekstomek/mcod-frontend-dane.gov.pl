import { Component, OnInit } from '@angular/core';

import { GroupedSearchHistory, SearchHistoryService } from '@app/services/search-history.service';
import { SeoService } from '@app/services/seo.service';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';

/**
 * Search History Component
 */
@Component({
  templateUrl: './search-history.component.html',
})
export class SearchHistoryComponent implements OnInit {
  /**
   * Router endpoints
   */
  routerEndpoints = RouterEndpoints;

  /**
   * Grouped search history
   */
  groupedSearchHistory: GroupedSearchHistory;

  /**
   * @ignore
   */
  constructor(private seoService: SeoService, private service: SearchHistoryService) {}

  /**
   * Get data from backend
   */
  ngOnInit(): void {
    this.seoService.setPageTitleByTranslationKey(['User.SearchHistory', 'MyDashboard.Self']);

    this.service.getGroupedSearchHistory().subscribe(data => {
      this.groupedSearchHistory = data;
    });
  }
}
