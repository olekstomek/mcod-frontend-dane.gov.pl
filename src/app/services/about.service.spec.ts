import { TestBed } from '@angular/core/testing';

import { AboutService } from './about.service';
import { HttpTestingController } from '@angular/common/http/testing';
import { ServiceTestbed } from '@app/services/tests/service.testbed';

describe('AboutService', () => {

    let service: AboutService;
    let httpMock: HttpTestingController;

    beforeEach(() => {
        TestBed.configureTestingModule(ServiceTestbed.module(AboutService));

        service = TestBed.get(AboutService);
        httpMock = TestBed.get(HttpTestingController);
    });

    afterEach(() => {
        httpMock.verify();
    });

    it('should be created', () => {
        expect(service).toBeDefined();
    });

    // xdescribe('#getPong', () => {
    //     it('should call GET to /', () => {
    //
    //         service.getPong().subscribe(data => {
    //             expect(data).toBe('');
    //         });
    //
    //         const req = httpMock.expectOne(service.base_url + '/');
    //         expect(req.request.method).toBe('GET');
    //         expect(req.request.body).toEqual(null);
    //         req.flush({result: {response: ''}});
    //     });
    // });
});
