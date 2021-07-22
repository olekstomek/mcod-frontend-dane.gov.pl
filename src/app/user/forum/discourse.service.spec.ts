import { TestBed } from '@angular/core/testing';

import { DiscourseService } from './discourse.service';

describe('DiscourseService', () => {
    let service: DiscourseService;

    beforeEach(() => {
        TestBed.configureTestingModule({});
        service = TestBed.inject(DiscourseService);
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });
});
