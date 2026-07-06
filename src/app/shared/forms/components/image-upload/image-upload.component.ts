import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  DestroyRef,
  ElementRef,
  forwardRef,
  inject,
  Injector,
  input,
  numberAttribute,
  signal,
  viewChild,
} from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import {
  AbstractControl,
  ControlValueAccessor,
  NgControl,
  NG_VALIDATORS,
  NG_VALUE_ACCESSOR,
  StatusChangeEvent,
  TouchedChangeEvent,
  ValidationErrors,
} from '@angular/forms';
import { filter } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { FileSizeComponent } from '@app/shared/file-size/file-size.component';

@Component({
  selector: 'app-image-upload',
  templateUrl: './image-upload.component.html',
  styleUrl: './image-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FileSizeComponent, TranslatePipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => ImageUploadComponent),
      multi: true,
    },
  ],
  host: {
    '(change)': 'onHostChange($event.target.files)',
    '[class.is-invalid]': 'isInvalid()',
  },
  standalone: true,
})
export class ImageUploadComponent implements ControlValueAccessor {
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);

  readonly labelTranslationKey = input('File.Self');
  readonly labelTranslationKeyHint = input('');
  readonly maxHeight = input(200, { transform: numberAttribute });
  readonly maxWidth = input(200, { transform: numberAttribute });
  readonly errorMessage = input('');

  protected readonly isInvalid = signal(false);

  constructor() {
    afterNextRender(() => {
      const ngControl = this.injector.get(NgControl, null, { self: true, optional: true });
      const control = ngControl?.control;
      if (!control) {
        return;
      }

      const update = (): void => this.isInvalid.set(!!(control.invalid && control.touched));
      update();

      control.events
        .pipe(
          filter((e) => e instanceof StatusChangeEvent || e instanceof TouchedChangeEvent),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => update());
    });
  }

  private readonly imageInput = viewChild.required<ElementRef<HTMLInputElement>>('imageInput');

  readonly uploadedFile = signal<File | null>(null);
  readonly uploadedImagePreview = signal<string | null>(null);
  readonly isDisabled = signal(false);

  readonly acceptedMimeTypes = ['image/jpeg', 'image/gif', 'image/png'];

  private onChange: (value: File | null) => void = () => {
    /* empty */
  };
  private onTouched: () => void = () => {
    /* empty */
  };

  onHostChange(files: FileList): void {
    const file = files?.item(0);
    if (!file) {
      return;
    }

    this.uploadedFile.set(file);
    this.onChange(file);
    this.onTouched();

    if (this.hasCorrectType(file.type)) {
      this.generateImagePreview(file);
    } else {
      this.uploadedImagePreview.set(null);
    }
  }

  onImageRemove(): void {
    this.uploadedFile.set(null);
    this.uploadedImagePreview.set(null);
    this.imageInput().nativeElement.value = '';
    this.onChange(null);
    this.onTouched();
  }

  triggerFileInput(): void {
    this.imageInput().nativeElement.click();
  }

  writeValue(value: File | null): void {
    if (!value) {
      this.uploadedFile.set(null);
      this.uploadedImagePreview.set(null);
      this.imageInput().nativeElement.value = '';
    }
  }

  registerOnChange(fn: (value: File | null) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    if (control.pristine || !control.value) {
      return null;
    }
    return this.hasCorrectType(control.value.type) ? null : { fileType: true };
  }

  private generateImagePreview(file: File): void {
    const reader = new FileReader();
    reader.readAsDataURL(file);
    reader.onloadend = () => this.uploadedImagePreview.set(reader.result as string);
  }

  private hasCorrectType(type: string): boolean {
    return this.acceptedMimeTypes.includes(type);
  }
}
