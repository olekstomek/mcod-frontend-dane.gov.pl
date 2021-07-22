import { HttpClientTestingModule } from '@angular/common/http/testing';
import { inject, TestBed } from '@angular/core/testing';
import { FormsModule, ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { SparqlEditorComponent } from '@app/pages/dataset/sparql/editor/sparql-editor-component';
import { SparqlComponent } from '@app/pages/dataset/sparql/sparql.component';
import { SparqlService } from '@app/pages/dataset/sparql/sparql.service';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { NotificationsService } from '@app/services/notifications.service';
import { NotificationsServerComponent } from '@app/shared/notifications-server/notifications-server.component';
import { NotificationsComponent } from '@app/shared/notifications/notifications.component';
import { PaginationComponent } from '@app/shared/pagination/pagination.component';
import { TranslateLoader, TranslateModule, TranslateService } from '@ngx-translate/core';
import { NgxLocalStorageModule } from 'ngx-localstorage';
import { BehaviorSubject, Observable } from 'rxjs';
import { of } from 'rxjs/internal/observable/of';

const translations = {
    'Sparql': {
        'Prefixes': 'Prefiksy',
        'SearchBy': 'Wyszukiwanie przy pomocy zapytań',
        'Description': 'Wyszukiwanie metadanych dostawców danych, zbiorów danych oraz danych w bazie danych RDF z wykorzystaniem języka zapytań SPARQL. Narzędzie przeznaczone jest dla doświadczonych użytkowników języka SPARQL. Specyfikację SPARQL można znaleźć na',
        'W3CPage': 'stronie W3C.',
        'Examples': 'Przykłady',
        'Format': 'Wybierz Format',
        'Request': 'Wykonaj zapytanie',
        'ResultPreview': 'Podgląd wyniku'
    },
};

class FakeLoader implements TranslateLoader {
    getTranslation(lang: string): Observable<any> {
        return of(translations);
    }
}


class MockkFeatureFlagService {

    featureFlags = new BehaviorSubject([]);

    isFlagEnabled = true;

    validateFlag(...args): boolean {
        return this.isFlagEnabled;
    }

    setFlag(isEnabled: boolean) {
        this.isFlagEnabled = isEnabled;
    }

}


describe('Sparql Component', () => {
    let translate: TranslateService;
    beforeEach(async () => {

        await TestBed.configureTestingModule({
            imports: [
                TranslateModule.forRoot({
                    loader: {provide: TranslateLoader, useClass: FakeLoader}
                }),
                HttpClientTestingModule,
                RouterTestingModule.withRoutes([]),
                NgxLocalStorageModule.forRoot(),
                ReactiveFormsModule,
                FormsModule
            ],
            declarations: [
                SparqlComponent,
                SparqlEditorComponent,
                NotificationsComponent,
                NotificationsServerComponent,
                PaginationComponent
            ],
            providers: [
                {provide: FeatureFlagService, useClass: MockkFeatureFlagService},
                SparqlService,
                NotificationsService
            ]
        }).compileComponents();

        translate = TestBed.inject(TranslateService);
        translate.use('pl');
    });

    it('should create component', () => {
        const fixture = TestBed.createComponent(SparqlComponent);
        const infoTooltipComponent = fixture.componentInstance;

        fixture.detectChanges();

        expect(infoTooltipComponent).toBeTruthy();

    });

    it('should render proper title', () => {
        const fixture = TestBed.createComponent(SparqlComponent);

        fixture.detectChanges();

        const title: HTMLElement = fixture.debugElement.query(By.css('.heading')).nativeElement;

        expect(title.textContent).toBe(' Wyszukiwanie przy pomocy zapytań SPARQL ');

    });


    it('should render hidden prefixes by default', () => {
        const fixture = TestBed.createComponent(SparqlComponent);

        fixture.detectChanges();

        const prefixes: HTMLElement = fixture.debugElement.query(By.css('#prefixes')).nativeElement;

        expect(prefixes.hidden).toBeTruthy();

    });


    it('should render hidden results by default', () => {
        const fixture = TestBed.createComponent(SparqlComponent);

        fixture.detectChanges();

        const result = fixture.debugElement.query(By.css('#sparqlResult'));

        expect(result).toBeFalsy();

    });


    it('should render disabled search button by default', () => {
        const fixture = TestBed.createComponent(SparqlComponent);

        fixture.detectChanges();

        const button: HTMLButtonElement = fixture.debugElement.query(By.css('.sparql-editor--btn')).nativeElement;

        expect(button.disabled).toBeTruthy();

    });


    it('should render xml/rdf as selected format by default', () => {
        const fixture = TestBed.createComponent(SparqlComponent);

        fixture.detectChanges();

        const selectedFormat: HTMLSelectElement = fixture.debugElement.query(By.css('option:checked')).nativeElement;

        expect(selectedFormat.textContent).toBe('RDF/XML');

    });

    it('should render disabled search button when query is invalid', () => {
        const fixture = TestBed.createComponent(SparqlComponent);

        fixture.detectChanges();

        setTimeout(() => {
            fixture.componentInstance.updateEditorContent('asdf');
        });

        fixture.detectChanges();

        return fixture.whenStable().then(() => {

            const button: HTMLButtonElement = fixture.debugElement.query(By.css('.sparql-editor--btn')).nativeElement;

            expect(button.disabled).toBeTruthy();
        });


    });


    it('should render 3 examples', () => {
        const fixture = TestBed.createComponent(SparqlComponent);

        fixture.detectChanges();

        const examplesCount = fixture.debugElement.queryAll(By.css('li')).length;

        expect(examplesCount).toBe(3);

    });


    it('should update query when user click on example', () => {
        const fixture = TestBed.createComponent(SparqlComponent);

        spyOn(fixture.componentInstance, 'updateEditorContent').and.stub();

        fixture.detectChanges();

        const example = fixture.debugElement.query(By.css('.sparql--example'));

        example.triggerEventHandler('click', {});

        expect(fixture.componentInstance.updateEditorContent).toHaveBeenCalledTimes(1);

    });


    it('should render error message when there is some error', inject([NotificationsService], (notificationsService: NotificationsService) => {
        const fixture = TestBed.createComponent(SparqlComponent);

        notificationsService.addError('Some Error');

        fixture.detectChanges();

        const errorMessage = fixture.debugElement.query(By.directive(NotificationsServerComponent));


        expect(errorMessage).toBeTruthy();

    }));

    it('should perform search on form submit', inject([SparqlService], (sparqlService: SparqlService) => {
        const fixture = TestBed.createComponent(SparqlComponent);

        fixture.detectChanges();

        setTimeout(() => {
            fixture.componentInstance.updateEditorContent('SELECT (count(?s) AS ?count)\n' +
                'WHERE\n' +
                '{\n' +
                '   ?s a dcat:Dataset\n' +
                '}');
        });

        fixture.detectChanges();

        spyOn(sparqlService, 'search').and.callFake(() => {
            return of();
        });

        return fixture.whenStable().then(() => {

            fixture.debugElement.query(By.css('form')).triggerEventHandler('submit', {});

            expect(sparqlService.search).toHaveBeenCalledTimes(1);

        });

    }));


    it('should render preview when search success', inject([SparqlService], (sparqlService: SparqlService) => {
        const fixture = TestBed.createComponent(SparqlComponent);

        fixture.detectChanges();

        setTimeout(() => {
            fixture.componentInstance.updateEditorContent('SELECT (count(?s) AS ?count)\n' +
                'WHERE\n' +
                '{\n' +
                '   ?s a dcat:Dataset\n' +
                '}');
        });

        fixture.detectChanges();

        spyOn(sparqlService, 'search').and.callFake(() => {
            return of({
                meta: {
                    count: 300
                },
                data: 'assff',
            });
        });

        return fixture.whenStable().then(() => {

            fixture.debugElement.query(By.css('form')).triggerEventHandler('submit', {});

            fixture.detectChanges();

            return fixture.whenStable().then(() => {
                const result = fixture.debugElement.query(By.css('#sparqlResult'));

                expect(result).toBeTruthy();
            });

        });

    }));


    it('should render download button when search success', inject([SparqlService], (sparqlService: SparqlService) => {
        const fixture = TestBed.createComponent(SparqlComponent);

        fixture.detectChanges();

        setTimeout(() => {
            fixture.componentInstance.updateEditorContent('SELECT (count(?s) AS ?count)\n' +
                'WHERE\n' +
                '{\n' +
                '   ?s a dcat:Dataset\n' +
                '}');
        });

        fixture.detectChanges();

        spyOn(sparqlService, 'search').and.callFake(() => {
            return of({
                meta: {
                    count: 300
                },
                data: 'assff',
            });
        });

        return fixture.whenStable().then(() => {

            fixture.debugElement.query(By.css('form')).triggerEventHandler('submit', {});

            fixture.detectChanges();

            return fixture.whenStable().then(() => {
                const button = fixture.debugElement.query(By.css('.btn'));

                expect(button).toBeTruthy();
            });

        });

    }));

});
