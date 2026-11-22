import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule } from '@ngx-translate/core';
import { Directive, Input, signal } from '@angular/core';
import { noop, of, throwError } from 'rxjs';

import { DatasetService } from '@app/services/dataset.service';
import { FavouriteActionService } from '@app/services/favourite-intent/favourite-action.service';
import { FavouriteErrorHandler } from '@app/services/favourite-intent/favourite-error-handler';
import { UserService } from '@app/services/user.service';
import { FavouritePostLoginService } from '@app/services/favourite-intent/favourite-post-login.service';

import { DetailsResultItemComponent } from '@app/shared/result-list/right-column/details-result-item/details-result-item.component';
import { ConfirmDialogService } from '@app/shared/confirm-dialog/confirm-dialog.service';
import { InfoTooltipDirective } from '@app/shared/info-tooltip/info-tooltip.directive';

class MockConfirmDialogService {
  open = noop;
  confirmed() {
    return of(true);
  }
}

@Directive({
  selector: '[appInfoTooltip]',
  standalone: true,
})
class MockInfoTooltipDirective {
  @Input() appInfoTooltip: string;
  @Input() tooltipTitle: string;
}

describe('DetailsResultItemComponent', () => {
  let component: DetailsResultItemComponent;
  let fixture: ComponentFixture<DetailsResultItemComponent>;
  const datasetService = {
    markDatasetAsLiked: jest.fn(),
    markDatasetAsUnliked: jest.fn(),
    getDatasetLikesCount: jest.fn(),
  };
  const favouriteActions = { request: jest.fn() };
  const errorHandler = { handle: jest.fn() };
  const userService = { isLoggedIn: jest.fn() };
  const readyDatasetId = signal<string | null>(null);
  const postLogin = { readyDatasetId, finish: jest.fn(), discardMissing: jest.fn() };

  beforeEach(() => {
    jest.clearAllMocks();
    userService.isLoggedIn.mockReturnValue(true);
    readyDatasetId.set(null);
    TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), DetailsResultItemComponent],
      providers: [
        { provide: DatasetService, useValue: datasetService },
        { provide: FavouriteActionService, useValue: favouriteActions },
        { provide: FavouriteErrorHandler, useValue: errorHandler },
        { provide: UserService, useValue: userService },
        { provide: FavouritePostLoginService, useValue: postLogin },
        { provide: ConfirmDialogService, useClass: MockConfirmDialogService },
      ],
    })
      .overrideComponent(DetailsResultItemComponent, {
        remove: { imports: [InfoTooltipDirective] },
        add: { imports: [MockInfoTooltipDirective] },
      })
      .compileComponents();

    fixture = TestBed.createComponent(DetailsResultItemComponent);
    component = fixture.componentInstance;
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });

  it('should set categoryIcon to ic-aplikacje when showcaseCategoryKey is app', () => {
    component.showcaseCategoryKey = 'app';
    component.ngOnInit();
    expect(component.categoryIcon).toEqual('ic-aplikacje');
  });

  it('should set categoryIcon to ic-portal-www when showcaseCategoryKey is www', () => {
    component.showcaseCategoryKey = 'www';
    component.ngOnInit();
    expect(component.categoryIcon).toEqual('ic-portal-www');
  });

  it('should set categoryIcon to ic-inne when showcaseCategoryKey is other', () => {
    component.showcaseCategoryKey = 'other';
    component.ngOnInit();
    expect(component.categoryIcon).toEqual('ic-inne');
  });

  it('should set iconName to dataset when titleTranslationKey is Datasets.Single', () => {
    component.titleTranslationKey = 'Datasets.Single';
    component.ngOnInit();
    expect(component.iconName).toEqual('dataset');
  });

  it('should set iconName to resource when titleTranslationKey is Resources.Single', () => {
    component.titleTranslationKey = 'Resources.Single';
    component.ngOnInit();
    expect(component.iconName).toEqual('resource');
  });

  it('shows a single favorite button per dataset, not one per detail row', () => {
    fixture.componentRef.setInput('detailsData', [
      { titleTranslationKey: 'Attribute.Title', data: 'One' },
      { titleTranslationKey: 'Attribute.Title', data: 'Two' },
    ]);
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-favorite-button')).toHaveLength(0);

    fixture.componentRef.setInput('isDatasetView', true);
    fixture.componentRef.setInput('datasetId', '123');
    fixture.detectChanges();
    expect(fixture.nativeElement.querySelectorAll('app-favorite-button')).toHaveLength(1);
    expect(fixture.nativeElement.querySelectorAll('app-favorite-counter')).toHaveLength(1);
  });

  it('likes dataset with POST and unlikes it with DELETE using counter from the response', () => {
    datasetService.markDatasetAsLiked.mockReturnValue(of(5));
    datasetService.markDatasetAsUnliked.mockReturnValue(of(4));
    fixture.componentRef.setInput('detailsData', [{ titleTranslationKey: 'Attribute.Title', data: 'One' }]);
    fixture.componentRef.setInput('isDatasetView', true);
    fixture.componentRef.setInput('datasetId', '123');
    fixture.componentRef.setInput('likesCount', 4);
    fixture.detectChanges();

    const button = () => fixture.nativeElement.querySelector('app-favorite-button button') as HTMLButtonElement;

    button().click();
    fixture.detectChanges();
    expect(datasetService.markDatasetAsLiked).toHaveBeenCalledWith('123');
    expect(button().classList.contains('is-favorite')).toBe(true);

    button().click();
    fixture.detectChanges();
    expect(datasetService.markDatasetAsUnliked).toHaveBeenCalledWith('123');
    expect(button().classList.contains('is-favorite')).toBe(false);
  });

  it('for a not logged in user saves the intent with list position instead of calling the API', () => {
    userService.isLoggedIn.mockReturnValue(false);
    fixture.componentRef.setInput('detailsData', [{ titleTranslationKey: 'Attribute.Title', data: 'One' }]);
    fixture.componentRef.setInput('isDatasetView', true);
    fixture.componentRef.setInput('datasetId', '123');
    fixture.componentRef.setInput('listPosition', 7);
    fixture.detectChanges();

    (fixture.nativeElement.querySelector('app-favorite-button button') as HTMLButtonElement).click();
    expect(favouriteActions.request).toHaveBeenCalledWith('123', 7);
    expect(datasetService.markDatasetAsLiked).not.toHaveBeenCalled();
  });

  describe('favourite request errors', () => {
    const button = () => fixture.nativeElement.querySelector('app-favorite-button button') as HTMLButtonElement;
    const setup = (liked: boolean) => {
      fixture.componentRef.setInput('detailsData', [{ titleTranslationKey: 'Attribute.Title', data: 'One' }]);
      fixture.componentRef.setInput('isDatasetView', true);
      fixture.componentRef.setInput('datasetId', '123');
      fixture.componentRef.setInput('likesCount', 4);
      fixture.detectChanges();
      if (liked) {
        datasetService.markDatasetAsLiked.mockReturnValueOnce(of(5));
        button().click();
        fixture.detectChanges();
      }
    };
    it('POST 409: reports "add", sets liked and refetches the counter', () => {
      setup(false);
      datasetService.markDatasetAsLiked.mockReturnValue(throwError(() => ({ status: 409 })));
      datasetService.getDatasetLikesCount.mockReturnValue(of(9));
      button().click();
      fixture.detectChanges();
      expect(errorHandler.handle).toHaveBeenCalledWith({ status: 409 }, 'add');
      expect(datasetService.getDatasetLikesCount).toHaveBeenCalledWith('123');
      expect(button().classList.contains('is-favorite')).toBe(true);
    });
    it('DELETE 409: reports "remove", clears liked and refetches the counter', () => {
      setup(true);
      datasetService.markDatasetAsUnliked.mockReturnValue(throwError(() => ({ status: 409 })));
      datasetService.getDatasetLikesCount.mockReturnValue(of(2));
      button().click();
      fixture.detectChanges();
      expect(errorHandler.handle).toHaveBeenCalledWith({ status: 409 }, 'remove');
      expect(datasetService.getDatasetLikesCount).toHaveBeenCalledWith('123');
      expect(button().classList.contains('is-favorite')).toBe(false);
    });
    it.each([404, 429, 500])('POST %s: reports "add", keeps state, no refetch, button unlocked', (status) => {
      setup(false);
      datasetService.markDatasetAsLiked.mockReturnValue(throwError(() => ({ status })));
      button().click();
      fixture.detectChanges();
      expect(errorHandler.handle).toHaveBeenCalledWith({ status }, 'add');
      expect(button().classList.contains('is-favorite')).toBe(false);
      expect(datasetService.getDatasetLikesCount).not.toHaveBeenCalled();
      datasetService.markDatasetAsLiked.mockClear();
      button().click();
      expect(datasetService.markDatasetAsLiked).toHaveBeenCalledTimes(1);
    });
    it.each([404, 429, 500])('DELETE %s: reports "remove", keeps liked, no refetch', (status) => {
      setup(true);
      datasetService.markDatasetAsUnliked.mockReturnValue(throwError(() => ({ status })));
      button().click();
      fixture.detectChanges();
      expect(errorHandler.handle).toHaveBeenCalledWith({ status }, 'remove');
      expect(button().classList.contains('is-favorite')).toBe(true);
      expect(datasetService.getDatasetLikesCount).not.toHaveBeenCalled();
    });
  });

  describe('resuming the favourite operation after login', () => {
    const setup = (likesCount: number | null) => {
      datasetService.getDatasetLikesCount.mockReturnValue(of(11));
      postLogin.finish.mockImplementation((_id, scroll, onAdded) => {
        scroll();
        onAdded(likesCount);
      });
      fixture.componentRef.setInput('detailsData', [{ titleTranslationKey: 'Attribute.Title', data: 'One' }]);
      fixture.componentRef.setInput('isDatasetView', true);
      fixture.componentRef.setInput('datasetId', '123');
      fixture.componentRef.setInput('likesCount', 4);
    };
    const button = () => fixture.nativeElement.querySelector('app-favorite-button button') as HTMLButtonElement;

    it('marks the dataset as favorite and uses the counter from the POST response', () => {
      setup(5);
      readyDatasetId.set('123');
      fixture.detectChanges();
      expect(postLogin.finish).toHaveBeenCalledWith('123', expect.any(Function), expect.any(Function));
      fixture.detectChanges();
      expect(button().classList.contains('is-favorite')).toBe(true);
      expect(datasetService.getDatasetLikesCount).not.toHaveBeenCalled();
    });

    it('fetches the counter when it was not returned (409 already added)', () => {
      setup(null);
      readyDatasetId.set('123');
      fixture.detectChanges();
      expect(datasetService.getDatasetLikesCount).toHaveBeenCalledWith('123');
      expect(button().classList.contains('is-favorite')).toBe(true);
    });

    it('does nothing for a different dataset', () => {
      setup(5);
      readyDatasetId.set('999');
      fixture.detectChanges();
      expect(postLogin.finish).not.toHaveBeenCalled();
    });
  });
});
