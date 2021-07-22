import { Injectable, NestMiddleware } from '@nestjs/common';
import { Request, Response } from 'express';

/**
 * Multi Language Middleware
 */
@Injectable()
export class MultiLanguageMiddleware implements NestMiddleware {

    /**
     * Redirects to page with language prefix when necessary
     * @param req
     * @param res
     * @param next
     */
    use(req: Request, res: Response, next: Function) {
        if (req.baseUrl.includes('api/mock') || req.baseUrl.includes('assets/') || req.baseUrl.includes('api/license')) {
            next();
            return;
        }
        const isLanguageProvided = this.isLanguageProvidedInRequest(req);

        this.addLanguageHeaders(req, res, isLanguageProvided);

        if (!isLanguageProvided) {
            const {host, originalURLWithoutLanguage} = this.getCurrentRouteURL(req, isLanguageProvided);
            res.set('location', `${host}/pl${originalURLWithoutLanguage === '/' ? '' : originalURLWithoutLanguage}`);
            res.status(301).send();
            return;
        }
        next();
    }

    /**
     * Adds language headers
     * @param req
     * @param res
     * @param isLanguageProvided
     */
    private addLanguageHeaders(req: Request, res: Response, isLanguageProvided: boolean): void {
        const {host, originalURLWithoutLanguage} = this.getCurrentRouteURL(req, isLanguageProvided);
        res.setHeader('Link', `<${host}/pl${originalURLWithoutLanguage}>; rel="alternate"; hreflang="pl", <${host}/en${originalURLWithoutLanguage}>; rel="alternate"; hreflang="en"`);
    }

    /**
     * Checks if language provided in request
     * @param req
     * @returns {boolean}
     */
    private isLanguageProvidedInRequest(req: Request): boolean {
        return !!req.originalUrl.match(/^(.*(\/pl).*)?(.*(\/en).*)?$/);
    }

    /**
     * Gets current route url
     * @param req
     * @param isLanguageProvided
     * @returns {{host: string, originalURLWithoutLanguage: string}}
     */
    private getCurrentRouteURL(req: Request, isLanguageProvided: boolean) {
        const originalURLWithoutLanguage = isLanguageProvided ?
            req.originalUrl.substring(3) :
            req.originalUrl;
        const host = req.protocol + '://' + req.get('host');
        return {originalURLWithoutLanguage, host};
    }

}
