import { TestBed, inject } from '@angular/core/testing';

import { DatasetService } from './dataset.service';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('DatasetService', () => {
    beforeEach(() => {
        TestBed.configureTestingModule(ServiceTestbed.module(DatasetService));
    });

    it('should be created', inject([DatasetService], (service: DatasetService) => {
        expect(service).toBeTruthy();
    }));
});
