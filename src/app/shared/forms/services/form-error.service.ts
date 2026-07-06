import { Injectable, signal } from '@angular/core';
import { HttpErrorResponse } from '@angular/common/http';

@Injectable()
export class FormErrorService {
  errorMessages = signal<string[]>([]);

  getErrorMessages(errorData: HttpErrorResponse): void {
    const messages: string[] = errorData.error?.errors?.map((item) => item.detail) ?? [];
    this.errorMessages.set(messages);
  }
}
