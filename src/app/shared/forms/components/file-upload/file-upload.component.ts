import {
  afterNextRender,
  ChangeDetectionStrategy,
  Component,
  computed,
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
  Validator,
} from '@angular/forms';
import { filter } from 'rxjs';
import { TranslatePipe } from '@ngx-translate/core';
import { FileSizeComponent } from '@app/shared/file-size/file-size.component';
import {
  allowedAttachmentExtensions,
  maxAttachmentsCount,
  maxAttachmentsTotalSize,
} from '@app/shared/forms/form-variables';
import {
  filesExtensionValidator,
  filesMaxCountValidator,
  filesTotalSizeValidator,
} from '@app/shared/forms/form-validators';

let nextId = 0;

@Component({
  selector: 'app-file-upload',
  templateUrl: './file-upload.component.html',
  styleUrl: './file-upload.component.scss',
  changeDetection: ChangeDetectionStrategy.OnPush,
  imports: [FileSizeComponent, TranslatePipe],
  providers: [
    {
      provide: NG_VALUE_ACCESSOR,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true,
    },
    {
      provide: NG_VALIDATORS,
      useExisting: forwardRef(() => FileUploadComponent),
      multi: true,
    },
  ],
  host: {
    '[class.is-invalid]': 'isInvalid()',
  },
  standalone: true,
})
export class FileUploadComponent implements ControlValueAccessor, Validator {
  private readonly injector = inject(Injector);
  private readonly destroyRef = inject(DestroyRef);
  private readonly fileInputRef = viewChild.required<ElementRef<HTMLInputElement>>('fileInput');

  readonly labelTranslationKey = input<string>('Forms.TopicSection.AttachmentUploader.Label');
  readonly maxFiles = input(maxAttachmentsCount, { transform: numberAttribute });
  readonly maxTotalSizeMb = input(maxAttachmentsTotalSize / (1024 * 1024), {
    transform: numberAttribute,
  });
  readonly acceptedFormats = input<string[]>(allowedAttachmentExtensions);

  protected readonly inputId = `file-upload-${++nextId}`;
  protected readonly files = signal<File[]>([]);
  protected readonly isDragOver = signal(false);
  protected readonly isDisabled = signal(false);
  protected readonly isInvalid = signal(false);
  protected readonly errors = signal<ValidationErrors | null>(null);

  protected readonly canAddMore = computed(() => this.files().length < this.maxFiles());
  protected readonly acceptAttr = computed(() =>
    this.acceptedFormats()
      .map((f) => `.${f.toLowerCase()}`)
      .join(','),
  );
  protected readonly formatsDisplay = computed(() => this.acceptedFormats().join(', '));

  private onChange: (value: File[]) => void = () => {
    /* empty */
  };
  private onTouched: () => void = () => {
    /* empty */
  };

  constructor() {
    afterNextRender(() => {
      const ngControl = this.injector.get(NgControl, null, { self: true, optional: true });
      const control = ngControl?.control;
      if (!control) {
        return;
      }

      const update = (): void => {
        this.isInvalid.set(!!(control.invalid && control.touched));
        this.errors.set(control.errors);
      };
      update();

      control.events
        .pipe(
          filter((e) => e instanceof StatusChangeEvent || e instanceof TouchedChangeEvent),
          takeUntilDestroyed(this.destroyRef),
        )
        .subscribe(() => update());
    });
  }

  writeValue(value: File[] | null): void {
    this.files.set(Array.isArray(value) ? value : []);
    this.fileInputRef().nativeElement.value = '';
  }

  registerOnChange(fn: (value: File[]) => void): void {
    this.onChange = fn;
  }

  registerOnTouched(fn: () => void): void {
    this.onTouched = fn;
  }

  setDisabledState(disabled: boolean): void {
    this.isDisabled.set(disabled);
  }

  validate(control: AbstractControl): ValidationErrors | null {
    const extensionErrors = filesExtensionValidator(this.acceptedFormats())(control);
    const sizeErrors = filesTotalSizeValidator(this.maxTotalSizeMb() * 1024 * 1024)(control);
    const countErrors = filesMaxCountValidator(this.maxFiles())(control);
    const merged: ValidationErrors = {
      ...(extensionErrors ?? {}),
      ...(sizeErrors ?? {}),
      ...(countErrors ?? {}),
    };
    return Object.keys(merged).length ? merged : null;
  }

  protected openFilePicker(): void {
    if (this.isDisabled()) {
      return;
    }
    this.fileInputRef().nativeElement.click();
  }

  protected onDragOver(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    if (this.canAddMore() && !this.isDisabled()) {
      this.isDragOver.set(true);
    }
  }

  protected onDragLeave(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
  }

  protected onDrop(event: DragEvent): void {
    event.preventDefault();
    event.stopPropagation();
    this.isDragOver.set(false);
    if (this.isDisabled()) {
      return;
    }
    const dropped = event.dataTransfer?.files;
    if (dropped?.length) {
      this.appendFiles(Array.from(dropped));
    }
  }

  protected onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;
    if (input.files?.length) {
      this.appendFiles(Array.from(input.files));
      input.value = '';
    }
  }

  protected removeFile(index: number): void {
    this.files.update((prev) => prev.filter((_, i) => i !== index));
    this.onChange(this.files());
    this.onTouched();
  }

  private appendFiles(newFiles: File[]): void {
    this.files.update((prev) => [...prev, ...newFiles]);
    this.onChange(this.files());
    this.onTouched();
  }
}
