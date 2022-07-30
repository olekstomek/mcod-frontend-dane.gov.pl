import { HttpClientTestingModule } from '@angular/common/http/testing';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { BreadcrumbService } from '@app/shared/breadcrumbs/breadcrumb.service';
import { BreadcrumbsComponent } from '@app/shared/breadcrumbs/breadcrumbs.component';
import { TranslateModule } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { of } from 'rxjs/internal/observable/of';

describe('BreadcrumbsComponent', () => {
  let component: BreadcrumbsComponent;
  let fixture: ComponentFixture<BreadcrumbsComponent>;
  let service: BreadcrumbService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [BreadcrumbsComponent],
      imports: [HttpClientTestingModule, RouterTestingModule, NgxLocalStorageModule.forRoot(), TranslateModule.forRoot()],
      providers: [BreadcrumbService],
    }).compileComponents();

    service = TestBed.inject(BreadcrumbService);
    fixture = TestBed.createComponent(BreadcrumbsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', async () => {
    expect(component).toBeDefined();
  });

  it('should unsubscribe when component is destroyed', async () => {
    component['breadcrumbs$'] = of().subscribe();
    const unsubscriptionSpy = jest.spyOn(component['breadcrumbs$'], 'unsubscribe');
    component.ngOnDestroy();
    expect(unsubscriptionSpy).toHaveBeenCalled();
  });
});
