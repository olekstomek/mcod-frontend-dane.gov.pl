import { HttpClientTestingModule } from '@angular/common/http/testing';
import { PLATFORM_ID } from '@angular/core';
import { inject, TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { RouterTestingModule } from '@angular/router/testing';
import { PageNotFoundComponent } from '@app/page-not-found/page-not-found.component';
import { SharedModule } from '@app/shared/shared.module';
import { ResponseService } from '@app/ssr/response.service';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

class MockResponseService {
    setStatusCode(code: number): void {
    }
}

describe('Page Not Found Component', () => {
    describe('Url without language', () => {
        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [
                    ReactiveFormsModule,
                    SharedModule,
                    HttpClientTestingModule,
                    RouterTestingModule,
                    TranslateModule.forRoot({
                        parser: {
                            provide: TranslateParser,
                            useClass: TranslateICUParser
                        },
                        defaultLanguage: 'pl',
                        useDefaultLang: true
                    }),
                ],
                declarations: [
                    PageNotFoundComponent
                ]
            }).compileComponents();
        });

        it('should create component', async () => {
            const fixture = TestBed.createComponent(PageNotFoundComponent);
            const pageNotFoundComponent = fixture.componentInstance;

            fixture.detectChanges();
            await fixture.whenStable();
            expect(pageNotFoundComponent).toBeTruthy();
        });


        it('should redirect to localized page when no language provided', inject([Router], async (router: Router) => {
            const routerNavigationSpy = spyOn(router, 'navigateByUrl').and.stub();
            const fixture = TestBed.createComponent(PageNotFoundComponent);

            fixture.detectChanges();
            await fixture.whenStable();
            expect(routerNavigationSpy).toHaveBeenCalledTimes(1);
        }));
    });

    describe('Url with language', () => {
        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [
                    ReactiveFormsModule,
                    SharedModule,
                    HttpClientTestingModule,
                    RouterTestingModule.withRoutes([
                        {path: 'pl', component: PageNotFoundComponent}
                    ]),
                    TranslateModule.forRoot({
                        parser: {
                            provide: TranslateParser,
                            useClass: TranslateICUParser
                        },
                        defaultLanguage: 'pl',
                        useDefaultLang: true
                    }),
                ],
                declarations: [
                    PageNotFoundComponent
                ]
            }).compileComponents();
        });

        it('should not redirect to localized page when language provided', inject([Router], async (router: Router) => {
            await router.navigate(['/pl']);
            const routerNavigationSpy = spyOn(router, 'navigateByUrl').and.stub();
            const fixture = TestBed.createComponent(PageNotFoundComponent);

            fixture.detectChanges();
            await fixture.whenStable();
            expect(routerNavigationSpy).toHaveBeenCalledTimes(0);
        }));
    });

    describe('SSR', () => {
        beforeEach(async () => {
            await TestBed.configureTestingModule({
                imports: [
                    ReactiveFormsModule,
                    SharedModule,
                    HttpClientTestingModule,
                    RouterTestingModule.withRoutes([
                        {path: 'pl', component: PageNotFoundComponent}
                    ]),
                    TranslateModule.forRoot({
                        parser: {
                            provide: TranslateParser,
                            useClass: TranslateICUParser
                        },
                        defaultLanguage: 'pl',
                        useDefaultLang: true
                    }),
                ],
                declarations: [
                    PageNotFoundComponent
                ],
                providers: [
                    {provide: PLATFORM_ID, useValue: 'server'},
                    {provide: ResponseService, useClass: MockResponseService}
                ]
            }).compileComponents();
        });

        it('should set response status code', inject([ResponseService], async (responseService: ResponseService) => {
            const setStatusCodeSpy = spyOn(responseService, 'setStatusCode').and.stub();
            const fixture = TestBed.createComponent(PageNotFoundComponent);

            fixture.detectChanges();
            await fixture.whenStable();
            expect(setStatusCodeSpy).toHaveBeenCalledTimes(1);
        }));

        it('should not redirect to localized page on ssr', inject([Router], async (router: Router) => {
            const routerNavigationSpy = spyOn(router, 'navigateByUrl').and.stub();
            const fixture = TestBed.createComponent(PageNotFoundComponent);

            fixture.detectChanges();
            await fixture.whenStable();
            expect(routerNavigationSpy).toHaveBeenCalledTimes(0);
        }));
    });


});
