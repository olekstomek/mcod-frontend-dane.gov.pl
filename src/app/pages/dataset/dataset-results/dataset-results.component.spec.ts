import { Component, Input, signal } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { provideRouter } from '@angular/router';
import { TranslateModule } from '@ngx-translate/core';
import { DatasetResultsComponent } from '@app/pages/dataset/dataset-results/dataset-results.component';
import { ApiModel } from '@app/services/api/api-model';
import { DatasetService } from '@app/services/dataset.service';
import { FavouriteActionService } from '@app/services/favourite-intent/favourite-action.service';
import { UserService } from '@app/services/user.service';
import { FavouritePostLoginService } from '@app/services/favourite-intent/favourite-post-login.service';
import { DetailsResultItemComponent } from '@app/shared/result-list/right-column/details-result-item/details-result-item.component';
import { SubscribeButtonComponent } from '@app/shared/subscribe-button/subscribe-button.component';
import { ResultListComponent } from '@app/shared/result-list/result-list.component';
import { DefaultResultItemComponent } from '@app/shared/result-list/result-item/default-result-item/default-result-item.component';
import { NgFor, NgIf } from '@angular/common';

@Component({
  selector: 'app-favorite-button',
  standalone: true,
  template: '',
})
class MockFavoriteButtonComponent {
  @Input() favorite = false;
  @Input() pending = false;
  @Input() useConfirmation = false;
}

@Component({
  selector: 'app-details-result-item',
  standalone: true,
  imports: [NgIf, MockFavoriteButtonComponent],
  template: '<app-favorite-button *ngIf="isDatasetView"></app-favorite-button>',
})
class MockDetailsResultItemComponent {
  @Input() isDatasetView = false;
  @Input() datasetId: string | null = null;
  @Input() detailsData: any;
  @Input() titleTranslationKey: string;
  @Input() listPosition = 1;
  @Input() favorite = false;
  @Input() likesCount = 0;
  @Input() useConfirmation = false;
}

@Component({
  selector: 'app-subscribe-button',
  standalone: true,
  template: '',
})
class MockSubscribeButtonComponent {
  @Input() item: any;
  @Input() bootstrapClass: string;
  @Input() tooltipText: string;
  @Input() tooltipTitle: string;
}

@Component({
  selector: 'app-result-list',
  standalone: true,
  imports: [NgFor, MockDetailsResultItemComponent],
  template: `
    <div *ngFor="let item of items">
      <app-details-result-item
        [isDatasetView]="item.attributes.model === 'dataset' || !item.attributes.model"
        [datasetId]="item.id">
      </app-details-result-item>
    </div>
  `,
})
class MockResultListComponent {
  @Input() items: any[] | null = [];
}

@Component({
  selector: 'app-default-result-item',
  standalone: true,
  template: '',
})
class MockDefaultResultItemComponent {
  @Input() item: any;
  @Input() detailsUrl: any;
  @Input() fromDatasetEndpoint = false;
}

describe('DatasetResultsComponent', () => {
  const readyDatasetId = signal<string | null>(null);
  const postLogin = { readyDatasetId, finish: jest.fn(), discardMissing: jest.fn() };
  let component: DatasetResultsComponent;
  let fixture: ComponentFixture<DatasetResultsComponent>;

  beforeEach(async () => {
    jest.clearAllMocks();
    readyDatasetId.set(null);
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), DatasetResultsComponent],
      providers: [
        provideRouter([]),
        { provide: DatasetService, useValue: {} },
        { provide: FavouriteActionService, useValue: { request: jest.fn() } },
        { provide: UserService, useValue: { isLoggedIn: () => false } },
        { provide: FavouritePostLoginService, useValue: postLogin },
      ],
    })
      .overrideComponent(DatasetResultsComponent, {
        remove: {
          imports: [
            ResultListComponent,
            DefaultResultItemComponent,
            DetailsResultItemComponent,
            SubscribeButtonComponent,
          ],
        },
        add: {
          imports: [
            MockResultListComponent,
            MockDefaultResultItemComponent,
            MockDetailsResultItemComponent,
            MockSubscribeButtonComponent,
          ],
        },
      })
      .compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('renders favorite only for datasets', () => {
    fixture.componentRef.setInput('items', [
      {
        id: '12',
        url: '/pl/dataset/12',
        attributes: { model: ApiModel.RESOURCE },
        detailsData: [{ titleTranslationKey: 'Attribute.Title', data: 'Resource' }],
        titleTranslationKey: 'Resources.Single',
      },
      {
        id: '34',
        url: '/pl/dataset/34',
        attributes: { model: ApiModel.DATASET },
        detailsData: [{ titleTranslationKey: 'Attribute.Title', data: 'Dataset' }],
        titleTranslationKey: 'Datasets.Single',
      },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-favorite-button')).toHaveLength(1);
  });

  describe('intent restored after login', () => {
    const item = (id: string) => ({
      id,
      url: `/pl/dataset/${id}`,
      attributes: { model: ApiModel.DATASET },
      detailsData: [{ titleTranslationKey: 'Attribute.Title', data: 'Dataset' }],
      titleTranslationKey: 'Datasets.Single',
    });

    it('discards the intent when the dataset is not on the restored list', () => {
      readyDatasetId.set('999');
      fixture.componentRef.setInput('items', [item('34')]);
      fixture.detectChanges();
      expect(postLogin.discardMissing).toHaveBeenCalledTimes(1);
    });

    it('keeps the intent when the dataset is on the list', () => {
      readyDatasetId.set('34');
      fixture.componentRef.setInput('items', [item('34')]);
      fixture.detectChanges();
      expect(postLogin.discardMissing).not.toHaveBeenCalled();
    });
  });
});
