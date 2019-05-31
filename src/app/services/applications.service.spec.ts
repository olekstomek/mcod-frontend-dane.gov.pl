import { TestBed} from '@angular/core/testing';

import { ApplicationsService } from './applications.service';
import { HttpTestingController } from '@angular/common/http/testing';

import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('ApplicationsService', () => {

    let service: ApplicationsService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule(ServiceTestbed.module(ApplicationsService));

        service = TestBed.get(ApplicationsService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeTruthy();
    });

    //
    // xdescribe('#getAll', () => {
    //     it('should return an Observable<T>', () => {
    //
    //         service.getAll({}).subscribe(data => {
    //             expect(data).toBe(jasmine.any(ApiResponse));
    //         });
    //
    //         const req = httpMock.expectOne(ApiConfig.applications);
    //         expect(req.request.method).toBe('GET');
    //         expect(req.request.body).toEqual({});
    //         req.flush('');
    //     });
    // });
});
