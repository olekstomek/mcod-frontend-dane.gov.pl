import { Directive, ElementRef, OnDestroy, OnInit } from '@angular/core';
import * as textMask from 'vanilla-text-mask/dist/vanillaTextMask.js';

/**
 * Date Input Mask Directive
 */
@Directive({
    selector: '[appMaskDate]'
})
export class DateInputMaskDirective implements OnInit, OnDestroy {

    /**
     * Mask
     * @type {(RegExp | string)[]}
     */
    mask = [/\d/, /\d/, '-', /\d/, /\d/, '-', /\d/, /\d/, /\d/, /\d/]; // dd/mm/yyyy

    /**
     * Mask input controller reference
     */
    maskedInputController;

    /**
     * @ignore
     */
    constructor(private element: ElementRef) {
    }

    /**
     * Setups date picker mask
     */
    ngOnInit() {
        this.maskedInputController = textMask.maskInput({
            inputElement: this.element.nativeElement,
            mask: this.mask
        });
    }

    /**
     * Cleanups
     */
    ngOnDestroy() {
        this.maskedInputController.destroy();
    }

}
