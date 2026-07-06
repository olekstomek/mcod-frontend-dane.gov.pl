import { AbstractControl, AsyncValidatorFn, ValidationErrors, ValidatorFn } from '@angular/forms';

export const datasetOrResourceLinkValidator: ValidatorFn = (control: AbstractControl): ValidationErrors | null => {
  const value: string = control.value;
  if (!value) {
    return null;
  }

  const { hostname, port } = window.location;
  const hostWithPort = port ? `${hostname}:${port}` : hostname;
  const escapedHost = hostWithPort.replace(/[.*+?^${}()|[\]\\:]/g, '\\$&');

  const scheme = `https?:\\/\\/`;
  const host = escapedHost;
  const lang = `[a-z]{2}`;
  const datasetId = `\\d+`;
  const slug = `[\\w-]+`;
  const optionalSlug = `(,${slug})?`;
  const datasetSegment = `dataset\\/${datasetId}${optionalSlug}`;
  const resourceSegment = `\\/resource\\/${datasetId}${optionalSlug}[\\/\\w-]*`;
  const optionalResource = `(${resourceSegment})?`;
  const optionalQueryOrFragment = `([\\?#].*)?`;

  const pattern = new RegExp(
    `^${scheme}${host}\\/${lang}\\/${datasetSegment}${optionalResource}${optionalQueryOrFragment}$`,
  );

  return pattern.test(value) ? null : { pattern: { requiredPattern: pattern.toString(), actualValue: value } };
};

export const requiredOneValueValidator = (checkboxControl: string, controlNames: string[]): ValidatorFn => {
  return (group: AbstractControl): ValidationErrors | null => {
    const boolCtrl = group.get(checkboxControl);

    if (!boolCtrl?.value) {
      return null;
    }

    const hasAtLeastOneValue = controlNames.some((name) => {
      const control = group.get(name);
      return !!control?.value;
    });

    if (!hasAtLeastOneValue) {
      return { requireOneValue: true };
    }

    return null;
  };
};

export const maxItemLengthCommaSeparatedValidator = (maxLength: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    if (!control.value || typeof control.value !== 'string') {
      return null;
    }
    const items = control.value.split(',');

    for (const item of items) {
      const trimmedItem = item.trim();
      if (trimmedItem.length > maxLength) {
        return {
          maxItemLength: {
            requiredLength: maxLength,
            actualLength: trimmedItem.length,
            invalidItem: trimmedItem,
          },
        };
      }
    }

    return null;
  };
};

export const maxFileSizeValidator = (maxFileSize: number): ValidatorFn => {
  return (control: AbstractControl): ValidationErrors | null => {
    const file: File = control.value;
    if (file?.size > maxFileSize) {
      return { maxFileSize: { actual: file.size, max: maxFileSize } };
    }
    return null;
  };
};

export const imageDimensionsValidator = (maxWidth: number, maxHeight: number): AsyncValidatorFn => {
  return (control: AbstractControl): Promise<ValidationErrors | null> => {
    const file: File = control.value;
    if (!file) return Promise.resolve(null);
    return new Promise((resolve) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = (event: ProgressEvent<FileReader>) => {
        const result = event.target?.result;
        if (result && typeof result === 'string') {
          const image = new Image();
          image.src = result;
          image.onload = () => {
            if (image.width > maxWidth || image.height > maxHeight) {
              resolve({
                maxDimensions: {
                  width: image.width,
                  height: image.height,
                  maxWidth,
                  maxHeight,
                },
              });
            } else {
              resolve(null);
            }
          };
        }
      };
    });
  };
};
