import { ComponentFixture, TestBed } from '@angular/core/testing';
import { DatasetResultsComponent } from '@app/pages/dataset/dataset-results/dataset-results.component';
import { TranslateModule } from '@ngx-translate/core';

describe('DefaultResultItemComponent ', () => {
  let component: DatasetResultsComponent;
  let fixture: ComponentFixture<DatasetResultsComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetResultsComponent],
      imports: [TranslateModule.forRoot()],
    });
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(DatasetResultsComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeDefined();
  });
});
