import { Component, EventEmitter, Input, OnChanges, Output, SimpleChange } from '@angular/core';
import { StrengthValidation } from '@app/shared/password-strength/strength-validation';

/**
 * Password strength indicator
 * @example
 * <app-password-strength
 * [passwordToCheck]="registration.password"
 * (validation)="checkPassword($event)">
 * </app-password-strength>
 */
@Component({
    selector: 'app-password-strength',
    templateUrl: './password-strength.component.html'
})
export class PasswordStrengthComponent implements OnChanges {

    /**
     * Provide password to check
     */
    @Input() passwordToCheck: string;

    /**
     * Outputs strength validation results for further event handling
     * @type {EventEmitter<any>}
     */
    @Output() validation: EventEmitter<StrengthValidation> = new EventEmitter();

    /**
     * @ignore
     */
    bar0: string;
    /**
     * @ignore
     */
    bar1: string;
    /**
     * @ignore
     */
    bar2: string;
    /**
     * @ignore
     */
    bar3: string;
    /**
     * @ignore
     */
    bar4: string;

    /**
     * Sets Accessibility label
     * @type {string}
     */
    textLabel = '';
    private colorClasses = ['bg-danger', 'bg-danger', 'bg-warning', 'bg-info', 'bg-success'];


    /**
     * On Input value changes check and update password validation and set indicators accordingly
     * @param {SimpleChange} changes
     */
    ngOnChanges(changes: { [propName: string]: SimpleChange }): void {
        const password = changes['passwordToCheck'].currentValue;
        this.setBarColors(5, 'password-strength__bar-none');

        if (password) {
            const strength = this.measureStrength(password);
            const color = this.getColor(strength);
            this.textLabel = color.label;

            this.setBarColors(color.level, color.value);
        } else
            this.textLabel = '';
    }

    /**
     * Measures strength of given password, outputs (emits) strength value, and returns force of the password
     * @param p {string}
     * @returns {number}
     */
    private measureStrength(p: string) {
        let _force = 0;
        const _regex = /[!-\/:-@\[-`\{-~]/g; // Covers all special characters on keyboard

        const _lowerLetters = /[a-z]+/.test(p);
        const _upperLetters = /[A-Z]+/.test(p);
        const _numbers = /[0-9]+/.test(p);
        const _symbols = _regex.test(p);

        const _flags = [_lowerLetters, _upperLetters, _numbers, _symbols];

        let _passedMatches = 0;
        for (const _flag of _flags) {
            _passedMatches += _flag === true ? 1 : 0;
        }

        _force += 2 * p.length + ((p.length >= 10) ? 1 : 0);
        _force += _passedMatches * 10;

        _force = (p.length <= 6) ? Math.min(_force, 10) : _force;

        _force = (_passedMatches === 1) ? Math.min(_force, 10) : _force;
        _force = (_passedMatches === 2) ? Math.min(_force, 20) : _force;
        _force = (_passedMatches === 3) ? Math.min(_force, 40) : _force;

        this.validation.emit(<StrengthValidation> {
            hasLowerCase: _lowerLetters,
            hasUpperCase: _upperLetters,
            hasNumber: _numbers,
            hasSpecialChar: _symbols,
            strength: _force
        });

        return _force;
    }

    /**
     * Generates and return labels and level of strength.
     * @param strength
     * @returns {{level: number; value: string; label: string}}
     */
    private getColor(strength) {
        let level = 0;
        let label = '';

        if (strength <= 10) {
            level = 0;
            label = 'Weak';
        } else if (strength <= 20) {
            level = 1;
            label = 'Weak';
        } else if (strength <= 30) {
            level = 2;
            label = 'Fair';
        } else if (strength <= 40) {
            level = 3;
            label = 'Good';
        } else {
            level = 4;
            label = 'Strong';
        }

        return {
            level: level + 1,
            value: this.colorClasses[level],
            label: label
        };
    }

    /**
     * Sets color of bars indicator
     * @param count
     * @param color
     */
    private setBarColors(count, color) {
        for (let _n = 0; _n < count; _n++) {
            this['bar' + _n] = color;
        }
    }

}
