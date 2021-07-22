import { Component, Input, OnInit } from "@angular/core";
import { FormControl } from "@angular/forms";

import { UserService } from "@app/services/user.service";

/**
 * Visual Password Validator Component
 * @example 
 *  <app-visual-password-validator
        [control]="registrationForm.get('password1')"
        [controlValueMinLength]="passwordMinLength"
        [customValidators]="passwordCustomValidators">
    </app-visual-password-validator>
 */
@Component({
    selector: "app-visual-password-validator",
    templateUrl: "./visual-password-validator.component.html"
})
export class VisualPasswordValidatorComponent implements OnInit {

    /**
     * @ignore 
     */
    constructor(private userService: UserService) {}

    /**
     * FormControl assosiacted with passwords field
     */
    @Input() control: FormControl;

    /**
     * Password min length
     */
    passwordMinLength: number;

    /**
     * Custom Validators - string helper name, error name returned by specified validator
     */
    customValidators: string[][];

    /**
     * Initializes validation indicators
     */
    ngOnInit() {
        this.passwordMinLength = this.userService.passwordMinLength;
        this.customValidators = this.userService.passwordCustomValidators;
    }
}
