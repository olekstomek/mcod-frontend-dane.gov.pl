import { TestBed, inject } from '@angular/core/testing';

import { AbstractService } from './abstract.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('AbstractService', () => {

    let service: AbstractService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule(ServiceTestbed.module(AbstractService));
        service = TestBed.get(AbstractService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', inject([AbstractService], (abService: AbstractService) => {
        expect(abService).toBeTruthy();
    }));
});
