import { TestBed } from '@angular/core/testing';
import { ResponseService } from '@app/ssr/response.service';
import { RESPONSE } from '@nguniversal/express-engine/tokens';


class MockResponse {
    status(code: number) {

    }
}

describe('Response service', () => {
    let service: ResponseService;
    let mockResponseService: MockResponse;
    beforeEach(() => {
        TestBed.configureTestingModule({
            providers: [
                ResponseService,
                {provide: RESPONSE, useClass: MockResponse}
            ]
        });
        service = TestBed.inject(ResponseService);
        mockResponseService = TestBed.inject(RESPONSE);
    });


    it('should create ', () => {
        const statusMock = spyOn(mockResponseService, 'status').and.stub();

        service.setStatusCode(200);

        expect(statusMock).toHaveBeenLastCalledWith(200);
    });

});
