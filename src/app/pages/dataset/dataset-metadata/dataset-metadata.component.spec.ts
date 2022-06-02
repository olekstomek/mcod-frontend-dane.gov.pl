import { ComponentFixture, TestBed } from '@angular/core/testing';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { DatasetMetadataComponent } from '@app/pages/dataset/dataset-metadata/dataset-metadata.component';

describe('DatasetMetadataComponent', () => {
  let component: DatasetMetadataComponent;
  let fixture: ComponentFixture<DatasetMetadataComponent>;

  beforeEach(() => {
    TestBed.configureTestingModule({
      declarations: [DatasetMetadataComponent],
      imports: [
        TranslateModule.forRoot({
          parser: {
            provide: TranslateParser,
            useClass: TranslateICUParser,
          },
          defaultLanguage: 'pl',
          useDefaultLang: true,
        }),
      ],
    });

    fixture = TestBed.createComponent(DatasetMetadataComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
