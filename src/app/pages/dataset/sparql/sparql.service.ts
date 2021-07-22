import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { map } from 'rxjs/internal/operators';

import { SparqlExample } from '@app/pages/dataset/sparql/domain/SparqlExample';
import { ApiConfig } from '@app/services/api';
import { RestService } from '@app/services/rest.service';

@Injectable({
    providedIn: 'root'
})
export class SparqlService extends RestService {

    /**
     * Gets Examples
     * @returns Array<SparqlExample>}
     */
    getExamples(): Array<SparqlExample> {
        return [
            {
                displayName: {pl: 'Liczba rekordów danych', en: 'Liczba rekordów danych'},
                codeSnippet: 'SELECT (count(?s) AS ?count)\n' +
                    'WHERE\n' +
                    '{\n' +
                    '   ?s a dcat:Dataset\n' +
                    '}'
            },
            {
                displayName: {pl: 'Wszystkie rekordy URls', en: 'Wszystkie rekordy URls'},
                codeSnippet: 'SELECT * WHERE\n' +
                    '{\n' +
                    '   ?s a dcat:Dataset\n' +
                    '} LIMIT 100'
            },
            {
                displayName: {pl: 'Zebrane katalogi', en: 'Zebrane katalogi'},
                codeSnippet: 'SELECT ?title ?language ?homepage ?description ?harvestEndpoint ?publishername\n' +
                    'WHERE\n' +
                    '{\n' +
                    '  ?catalogue a dcat:Catalog;\n' +
                    'dct:title ?title;\n' +
                    'dct:language ?language;\n' +
                    'dct:description ?description;\n' +
                    'dct:publisher ?publisher .\n' +
                    '?publisher <http://xmlns.com/foaf/0.1/name> ?publishername .\n' +
                    'OPTIONAL {\n' +
                    '?catalogue <https://europeandataportal.eu/voc#harvestEndpoint> ?harvestEndpoint .\n' +
                    '} OPTIONAL {\n' +
                    '?catalogue <http://xmlns.com/foaf/0.1/homepage> ?homepage .\n' +
                    '}}\n' +
                    'LIMIT 100'
            },
        ];
    }

    /**
     * Gets default prefixes
     * @returns {string}
     */
    getDefaultPrefixes(): Observable<string> {
        return this.get(ApiConfig.sparql)
            .pipe(map(({data}) => {
                return data.map(({attributes: item}) => {
                    return `PREFIX ${item.prefix}: <${item.url}>`;
                });
            }));
    }

    /**
     * Performs sparql search
     * @param sparql
     * @param format
     * @param page
     * @returns {Observable<{data: string, meta: {count: number}}> | Observable<{data: string, meta: {count: number}}>}
     */
    search(sparql: string, format: string, page: number): Observable<any> {
        const data = {
            data: {
                type: 'sparql',
                attributes: {
                    q: sparql,
                    format: format,
                    per_page: 100,
                    page: page
                }
            }
        };
        return this.post(ApiConfig.sparql, data, undefined,);
    }
}
