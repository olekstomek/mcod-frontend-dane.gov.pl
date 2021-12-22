import { HttpService, Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';
import { Observable, of } from 'rxjs';
import { map, switchMap } from 'rxjs/operators';

import { APP_CONFIG } from '@app/app.config';

/**
 * Csrf Middleware
 */
@Injectable()
export class CsrfMiddleware implements NestMiddleware {
  /**
   * @ignore
   */
  constructor(private httpService: HttpService) {}

  /**
   * Adds csrf token when necessary
   * @param req
   * @param res
   * @param next
   */
  use(req: Request, res: Response, next: Function) {
    if (req.baseUrl.includes('api/mock')) {
      next();
      return;
    }
    this.addCsrfTokenCookie(req, res).subscribe(
      () => {
        next();
      },
      () => next(),
    );
  }

  /**
   * Adds csrf token cookie to response
   * @param req
   * @param res
   * @returns {Observable<undefined extends ObservableInput<infer T> ? T : never | boolean> | Observable<any>}
   */
  addCsrfTokenCookie(req: Request, res: Response): Observable<any> {
    if (req.cookies[APP_CONFIG.csrfCookieName]) {
      return of(null);
    }
    return this.getHeadersForCsrf(req).pipe(
      switchMap(tokens => {
        const cookieHeaders = tokens['set-cookie'];
        if (!cookieHeaders) {
          return;
        }
        cookieHeaders.forEach(token => {
          if (token.startsWith(APP_CONFIG.csrfCookieName)) {
            if (!res.getHeader('set-cookie')) {
              res.setHeader('set-cookie', token);
            } else {
              const cookiesHeaders = res.getHeader('set-cookie') as string | Array<string>;
              const cookiesHeadersArr = Array.isArray(cookiesHeaders) ? cookiesHeaders : [cookiesHeaders];
              res.setHeader('set-cookie', [...cookiesHeadersArr, token]);
            }
          }
        });
        return of(true);
      }),
    );
  }

  /**
   * Gets csrf headers from API
   * @param req
   * @returns {Observable<any>}
   */
  private getHeadersForCsrf(req: Request) {
    const hostWithProtocol = req.protocol + '://' + req.get('host');
    const pingURL = `${
      req.get('host').includes('localhost') ? hostWithProtocol + '/api' : req.protocol + '://' + 'api.' + req.get('host')
    }/ping`;
    console.log(pingURL);
    return this.httpService.get(pingURL).pipe(map(response => response.headers));
  }
}
