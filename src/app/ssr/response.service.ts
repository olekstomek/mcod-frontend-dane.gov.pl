import { Inject, Injectable } from '@angular/core';
import { RESPONSE } from '@nguniversal/express-engine/tokens';
import { Response } from 'express';

/**
 * Response Service
 */
@Injectable()
export class ResponseService {


    /**
     * @ignore
     */
    constructor(@Inject(RESPONSE) private readonly response: Response) {
    }

    /**
     * Sets response status code
     * @param code
     */
    setStatusCode(code: number): void {
        this.response.status(code);
    }
}

