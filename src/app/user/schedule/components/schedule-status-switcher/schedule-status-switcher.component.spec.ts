import { TestBed } from '@angular/core/testing';
import { ReactiveFormsModule } from '@angular/forms';

import { ScheduleStatusSwitcherComponent } from '@app/user/schedule/components/schedule-status-switcher/schedule-status-switcher.component';


describe('Schedule Status Switcher Component', () => {
    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ReactiveFormsModule],
            declarations: [
                ScheduleStatusSwitcherComponent
            ],
        }).compileComponents();
    });

    it('should create component', () => {
        const fixture = TestBed.createComponent(ScheduleStatusSwitcherComponent);
        const scheduleStatusSwitcherComponent = fixture.componentInstance;
        expect(scheduleStatusSwitcherComponent).toBeTruthy();
    });


    it('should cleanup subscriptions on destroy', () => {
        const fixture = TestBed.createComponent(ScheduleStatusSwitcherComponent);
        const scheduleStatusSwitcherComponent = fixture.componentInstance;
        const cleanup$ = spyOn(scheduleStatusSwitcherComponent['cleanup$'], 'next').and.callThrough();
        fixture.detectChanges();
        fixture.destroy();
        expect(cleanup$).toHaveBeenCalled();
    });

    it('should emit event when value changed', () => {
        const fixture = TestBed.createComponent(ScheduleStatusSwitcherComponent);
        const scheduleStatusSwitcherComponent = fixture.componentInstance;
        const test = spyOn(scheduleStatusSwitcherComponent['cleanup$'], 'next').and.callThrough();
        fixture.detectChanges();

        let statusEventValue;
        scheduleStatusSwitcherComponent.scheduleStatusChanged.subscribe(status => statusEventValue = status);
        scheduleStatusSwitcherComponent.completedFormControl.setValue('asdf');
        fixture.detectChanges();

        expect(statusEventValue).toBe('asdf');
    });

});
