import { TestBed, inject } from '@angular/core/testing';

import { SeoService } from './seo.service';
import { TranslateModule } from '@ngx-translate/core';

describe('SeoService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot()
            ],
            providers: [SeoService]
        });

    });

    it('should be created', inject([SeoService], (service: SeoService) => {
        expect(service).toBeTruthy();
    }));
});
