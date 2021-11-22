import { TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';
import { FeatureFlagService } from '@app/services/feature-flag.service';
import { FeatureFlagDirective } from '@app/shared/feature-flags/feature-flag.directive';
import { InfoTooltipComponent } from '@app/shared/info-tooltip/info-tooltip.component';
import { TranslateModule } from '@ngx-translate/core';
import { TooltipDirective } from 'ngx-bootstrap';
import { BehaviorSubject } from 'rxjs';


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


describe('Info tooltip Component', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [TranslateModule.forRoot()],
            declarations: [
                InfoTooltipComponent,
                TooltipDirective,
                FeatureFlagDirective
            ],
            providers: [{provide: FeatureFlagService, useClass: MockkFeatureFlagService}]
        }).compileComponents();
    });

    it('should create component', () => {
        const fixture = TestBed.createComponent(InfoTooltipComponent);
        const infoTooltipComponent = fixture.componentInstance;
        expect(infoTooltipComponent).toBeTruthy();
    });


    it('should render proper tooltip', () => {
        const fixture = TestBed.createComponent(InfoTooltipComponent);
        const infoTooltipComponent = fixture.componentInstance;
        infoTooltipComponent.text = 'Asdf';

        fixture.detectChanges();

        return fixture.whenStable().then(() => {
            const text = fixture.debugElement.query(By.css('.info-tooltip')).properties.appTooltip;
            expect(text).toBe('Asdf');
        });

    });

});
