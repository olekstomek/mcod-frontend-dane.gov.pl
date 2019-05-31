import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';

import { RestService } from '@app/services/rest.service';
import { ApiConfig } from '@app/services/api';
import { SearchHistory } from '@app/services/models/search-history';

/**
 * Search history service
 * Fetches search terms typed in search box in dataset, application and articles modules
 */
@Injectable()
export class SearchHistoryService extends RestService {

    getSearchHistory(page = 1): Observable<SearchHistory> {
        return this.get(ApiConfig.searchHistory, {per_page: 100, page: page}).pipe(
            map(data => new SearchHistory(data.data))
        );
    }

}
