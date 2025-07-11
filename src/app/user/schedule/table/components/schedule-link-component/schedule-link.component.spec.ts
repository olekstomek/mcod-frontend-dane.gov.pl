import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';
import { By } from '@angular/platform-browser';
import { RouterTestingModule } from '@angular/router/testing';
import { ScheduleLinkComponent } from '@app/user/schedule/table/components/schedule-link-component/schedule-link.component';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { SharedModule } from '@app/shared/shared.module';
import { ConfirmationModalComponent } from '@app/user/schedule/table/components/confirmation-modal/confirmation-modal.component';
import { ScheduleButtonComponent } from '@app/user/schedule/table/components/schedule-button-component/schedule-button.component';

describe('Schedule Link Component', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [
                ReactiveFormsModule,
                SharedModule,
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
                ScheduleLinkComponent
            ],
        }).compileComponents();
    });

    it('should create component', async () => {
        const fixture = TestBed.createComponent(ScheduleLinkComponent);
        const deleteConfirmationModalComponent = fixture.componentInstance;

        fixture.detectChanges();
        await fixture.whenStable();
        expect(deleteConfirmationModalComponent).toBeTruthy();
    });

});
