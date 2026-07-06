import { afterNextRender, Directive, ElementRef, inject, Injector } from '@angular/core';
import { FormGroupDirective, NgForm } from '@angular/forms';
import { scrollToFirstError } from '@app/shared/forms/utils/scroll-to-first-error';

@Directive({
  selector: 'form[appScrollToFirstError]',
  standalone: true,
  host: {
    '(ngSubmit)': 'onNgSubmit()',
  },
})
export class ScrollToFirstErrorDirective {
  private readonly host = inject<ElementRef<HTMLFormElement>>(ElementRef);
  private readonly injector = inject(Injector);
  private readonly formGroupDir = inject(FormGroupDirective, { optional: true });
  private readonly ngForm = inject(NgForm, { optional: true });

  protected onNgSubmit(): void {
    const form = this.formGroupDir?.form ?? this.ngForm?.form;
    if (!form || form.valid) {
      return;
    }

    form.markAllAsTouched();

    afterNextRender(
      () => {
        scrollToFirstError(this.host.nativeElement);
      },
      { injector: this.injector },
    );
  }
}
