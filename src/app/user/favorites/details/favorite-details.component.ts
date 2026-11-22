import { Component, inject, signal, OnInit, ChangeDetectionStrategy } from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { BasicPageParams } from '@app/services/models/page-params';
import { LikesApiResponse, ObserveService } from '@app/services/observe.service';
import { ApiModel } from '@app/services/api/api-model';
import { Params, RouterLink } from '@angular/router';
import { ItemsPerPageComponent } from '@app/shared/items-per-page/items-per-page.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';
import { ListViewDetailsService } from '@app/services/list-view-details.service';
import { ISearchResult } from '@app/services/models/search';
import { LoginService } from '@app/services/login-service';
import { DatasetResultsComponent } from '@app/pages/dataset/dataset-results/dataset-results.component';
import { finalize } from 'rxjs';
import { LocalizeRouterModule, LocalizeRouterPipe } from '@gilsdav/ngx-translate-router';
import { RouterEndpoints } from '@app/services/models/routerEndpoints';
import { SeoService } from '@app/services/seo.service';

@Component({
  selector: 'app-favorite-details',
  standalone: true,
  imports: [
    TranslatePipe,
    NotificationsServerComponent,
    ItemsPerPageComponent,
    PaginationComponent,
    DatasetResultsComponent,
    LocalizeRouterPipe,
    RouterLink,
    LocalizeRouterModule,
    AsyncPipe,
  ],
  styleUrls: ['./favorite-details.component.scss'],
  templateUrl: './favorite-details.component.html',
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class FavoriteDetailsComponent implements OnInit {
  protected params = signal<BasicPageParams>({
    page: 1,
    per_page: 5,
    sort: '-date',
  });

  protected items = signal<ISearchResult[] | null>(null);
  protected count = signal<number>(0);
  protected loginService = inject(LoginService);
  protected sortOptions: { label: string; value: string }[] = [{ label: 'Attribute.Date', value: '-date' }];

  private _observeService = inject(ObserveService);
  private _listViewDetailsService = inject(ListViewDetailsService);
  private readonly translate = inject(TranslateService);
  protected readonly isRequestPending = signal(false);
  private _subscriptionType = ApiModel.DATASET;

  private readonly seoService = inject(SeoService);

  ngOnInit(): void {
    this.seoService.setPageTitleByTranslationKey(['Favorites.Dashboard.NavLink', 'MyDashboard.Self']);
    this._getLikesItems();
  }

  protected updateParams(newParams: Params): void {
    this.params.update((current) => ({ ...current, ...newParams }));
    this._getLikesItems();
  }

  protected hasNoItems(): boolean {
    const currentItems: ISearchResult[] | null = this.items();
    if (!currentItems) {
      return false;
    }
    return currentItems.length === 0;
  }

  protected onChildFavoriteChanged(): void {
    this._updatePaginationOnFavoriteChange();
    this._getLikesItems();
  }

  private _updatePaginationOnFavoriteChange(): void {
    const currentParams: BasicPageParams = this.params();
    const page: number = currentParams.page ?? 1;
    const perPage = Number(currentParams.per_page ?? 5);
    const totalCount: number = this.count();
    let newPage: number = page;

    const newTotalCount = Math.max(0, totalCount - 1);
    const maxPages = Math.ceil(newTotalCount / perPage) || 1;

    if (page > maxPages) {
      newPage = maxPages;
    }

    this.params.update((current) => ({
      ...current,
      page: newPage,
      _t: new Date().getTime(),
    }));
  }

  private _getLikesItems(): void {
    this.isRequestPending.set(true);
    this._observeService
      .getLikes(this._subscriptionType, this.params())
      .pipe(finalize(() => this.isRequestPending.set(false)))
      .subscribe({
        next: (response: LikesApiResponse) => {
          const itemsList: ISearchResult[] = response?.data ?? [];
          const totalCount = response?.meta?.count ?? 0;
          this.count.set(totalCount);

          if (itemsList.length === 0) {
            if (!this.hasNoItems()) {
              this.items.set([]);
            }
            return;
          }

          const likeItems = this._listViewDetailsService.extendViewDetails(itemsList);
          likeItems.forEach((item) => {
            const currentLang = this.translate.currentLang || this.translate.defaultLang || 'pl';
            item.url = `/${currentLang}/${RouterEndpoints.DATASETS}/${item.id},${item.attributes.slug}`;
          });

          this.items.set(likeItems);
        },
      });
  }
}
