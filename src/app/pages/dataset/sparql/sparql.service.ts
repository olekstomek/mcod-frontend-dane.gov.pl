import { Injectable } from '@angular/core';
import { SparqlExample } from '@app/pages/dataset/sparql/domain/SparqlExample';
import { RestService } from '@app/services/rest.service';
import { Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';

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
    getDefaultPrefixes(): string {
        return 'PREFIX adms: <http://www.w3.org/ns/adms#>\n' +
            'PREFIX dcat: <http://www.w3.org/ns/dcat#>\n' +
            'PREFIX dct: <http://purl.org/dc/terms/>\n' +
            'PREFIX foaf: <http://xmlns.com/foaf/0.1/>\n' +
            'PREFIX hydra: <http://www.w3.org/ns/hydra/core#>\n' +
            'PREFIX owl: <http://www.w3.org/2002/07/owl#>\n' +
            'PREFIX rdf: <http://www.w3.org/1999/02/22-rdf-syntax-ns#>\n' +
            'PREFIX skos: <http://www.w3.org/2004/02/skos/core#>\n' +
            'PREFIX vcard: <http://www.w3.org/2006/vcard/ns#>';
    }

    /**
     * Performs sparql search
     * @param sparql
     * @param format
     * @param page
     * @returns {Observable<{data: string, meta: {count: number}}> | Observable<{data: string, meta: {count: number}}>}
     */
    search(sparql: string, format: string, page: number): Observable<any> {
        // TODO remove mock
        if (page === 3) {
            this.notificationService.addError('Błędne zapytanie');
            return of({
                meta: {
                    count: 0
                },
                data: 'assff',
            });
        }
        if (page === 2) {
            return of({
                meta: {
                    count: 300
                },
                data: 'assff',
            });
        }
        return of({
            meta: {
                count: 300
            },
            data: `<rdf:RDF
    xmlns:rdf="http://www.w3.org/1999/02/22-rdf-syntax-ns#"
    xmlns:rs="http://www.w3.org/2001/sw/DataAccess/tests/result-set#"
    xmlns:xsd="http://www.w3.org/2001/XMLSchema#">
  <rs:ResultSet>
    <rs:size rdf:datatype="http://www.w3.org/2001/XMLSchema#int"
    >1</rs:size>
    <rs:solution rdf:parseType="Resource">
      <rs:binding rdf:parseType="Resource">
        <rs:value rdf:datatype="http://www.w3.org/2001/XMLSchema#integer"
        >1130106</rs:value>
        <rs:variable>count</rs:variable>
      </rs:binding>
    </rs:solution>
    <rs:resultVariable>count</rs:resultVariable>
  </rs:ResultSet>
</rdf:RDF>
\t\t\t\t\t\t\t`
        });
    }

    /**
     * Downloads sparql result
     * @param sparql
     * @param format
     */
    download(sparql: string, format: string): void {

    }
}
