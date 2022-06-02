import { HttpParams } from '@angular/common/http';
import { Injectable } from '@angular/core';
import pathToRegexp from 'path-to-regexp';
import { Observable } from 'rxjs';
import { map, shareReplay } from 'rxjs/operators';

import { ApiConfig } from '@app/services/api';
import { RestService } from '@app/services/rest.service';
import { Tour } from '@app/shared/tour/Tour';

/**
 * Tour data service
 */
@Injectable()
export class TourDataService extends RestService {
  /**
   * Cached list of routes with visible button
   * @type {Observable<{[p: string]: boolean}>}
   */
  private routesWithVisibleButton$: Observable<{ [key: string]: boolean }>;

  /**
   * Tours observable reference
   * @type {Observable<Array<Tour>>}
   */
  private getTours$: Observable<Array<Tour>>;

  /**
   * Fetches tours from api
   * @returns {Observable<Array<Tour>>}
   */
  getTours(): Observable<Array<Tour>> {
    if (!this.getTours$) {
      const params = new HttpParams().append('include', 'item');
      this.getTours$ = this.get(ApiConfig.guides, params).pipe(map(this.mapResponseToTour()), shareReplay());
    }
    return this.getTours$;
  }

  /**
   * Fetches single tour by id from API
   * @param id
   * @returns {Observable<Tour>}
   */
  getTourById(id: string): Observable<Tour> {
    return this.getTours().pipe(map(tours => tours.find(tour => tour.id === id)));
  }

  /**
   * Gets tour for route
   * @param routeToFind
   * @returns {Observable<Tour | null>}
   */
  getTourForRoute(routeToFind: string): Observable<Tour | null> {
    return this.getTours().pipe(
      map(tours => {
        for (let i = 0; i < tours.length; i++) {
          const tour = tours[i];
          for (let j = 0; j < tour.items.length; j++) {
            const tourItem = tour.items[j];
            const routeRegExp = pathToRegexp(tourItem.route);
            if (routeRegExp.test(routeToFind)) {
              return tour;
            }
          }
        }
        return null;
      }),
    );
  }

  /**
   * Gets routes where tour button should be visible
   * @returns {Observable<{[p: string]: boolean}>}
   */
  getRoutesWhereTourShouldButtonVisible(): Observable<{ [key: string]: boolean }> {
    if (!this.routesWithVisibleButton$) {
      this.routesWithVisibleButton$ = this.getTours().pipe(
        map(tours => {
          const routes = {};
          tours.forEach(tour => {
            tour.items.forEach(tourItem => {
              routes[tourItem.route] = true;
            });
          });
          return routes;
        }),
        shareReplay(),
      );
    }
    return this.routesWithVisibleButton$;
  }

  /**
   * Maps response to Tour
   * @returns {(response) => any}
   */
  private mapResponseToTour(): (response) => any {
    return response => {
      const idPerItem = {};
      response.included?.forEach(item => (idPerItem[item.id] = item.attributes));
      return response.data.map(tour => {
        return {
          id: tour.id,
          name: tour.attributes.name,
          items: tour.relationships.items.data.map(item => idPerItem[item.id]),
        } as Tour;
      });
    };
  }
}
