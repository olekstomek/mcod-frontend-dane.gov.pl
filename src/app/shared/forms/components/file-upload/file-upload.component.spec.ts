import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { TranslateModule } from '@ngx-translate/core';
import { FileUploadComponent } from './file-upload.component';

describe('FileUploadComponent', () => {
  let fixture: ComponentFixture<FileUploadComponent>;
  let component: FileUploadComponent;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TranslateModule.forRoot(), ReactiveFormsModule, FileUploadComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(FileUploadComponent);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  const makeFile = (name: string, size: number, type = 'text/plain'): File => {
    const file = new File(['x'], name, { type });
    Object.defineProperty(file, 'size', { value: size });
    return file;
  };

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should return null errors for empty value', () => {
    const control = new FormControl<File[]>([], { nonNullable: true });

    const errors = component.validate(control);

    expect(errors).toBeNull();
  });

  it('should return fileType error for disallowed extensions', () => {
    const control = new FormControl<File[]>([makeFile('malware.exe', 100)], { nonNullable: true });

    const errors = component.validate(control);

    expect(errors?.['fileType']).toBeTruthy();
    expect(errors?.['fileType'].invalidFiles).toEqual(['malware.exe']);
  });

  it('should return maxTotalSize error when total size exceeds limit', () => {
    const control = new FormControl<File[]>(
      [makeFile('a.pdf', 20 * 1024 * 1024), makeFile('b.pdf', 20 * 1024 * 1024)],
      { nonNullable: true },
    );

    const errors = component.validate(control);

    expect(errors?.['maxTotalSize']).toBeTruthy();
    expect(errors?.['maxTotalSize'].max).toBe(30 * 1024 * 1024);
  });

  it('should return maxFiles error when file count exceeds limit', () => {
    const control = new FormControl<File[]>(
      [makeFile('a.pdf', 100), makeFile('b.pdf', 100), makeFile('c.pdf', 100), makeFile('d.pdf', 100)],
      { nonNullable: true },
    );

    const errors = component.validate(control);

    expect(errors?.['maxFiles']).toBeTruthy();
    expect(errors?.['maxFiles'].actual).toBe(4);
  });

  it('should aggregate multiple validation errors', () => {
    const control = new FormControl<File[]>(
      [makeFile('a.exe', 1), makeFile('b.pdf', 1), makeFile('c.pdf', 1), makeFile('d.pdf', 1)],
      { nonNullable: true },
    );

    const errors = component.validate(control);

    expect(errors?.['fileType']).toBeTruthy();
    expect(errors?.['maxFiles']).toBeTruthy();
  });

  it('should append files on drop', () => {
    const changes: File[][] = [];
    component.registerOnChange((value: File[]) => changes.push(value));
    const droppedFile = makeFile('doc.pdf', 500);
    const dataTransfer = { files: [droppedFile] } as unknown as DataTransfer;
    const event = new Event('drop') as DragEvent;
    Object.defineProperty(event, 'dataTransfer', { value: dataTransfer });

    (component as unknown as { onDrop: (e: DragEvent) => void }).onDrop(event);

    expect(changes).toEqual([[droppedFile]]);
  });

  it('should remove a file by index', () => {
    const changes: File[][] = [];
    const first = makeFile('a.pdf', 100);
    const second = makeFile('b.pdf', 100);
    component.writeValue([first, second]);
    component.registerOnChange((value: File[]) => changes.push(value));

    (component as unknown as { removeFile: (i: number) => void }).removeFile(0);

    expect(changes).toEqual([[second]]);
  });

  it('setDisabledState should mark component as disabled', () => {
    const isDisabled = (component as unknown as { isDisabled: () => boolean }).isDisabled;

    component.setDisabledState(true);

    expect(isDisabled()).toBe(true);
  });

  it('setDisabledState should mark component as enabled', () => {
    const isDisabled = (component as unknown as { isDisabled: () => boolean }).isDisabled;
    component.setDisabledState(true);

    component.setDisabledState(false);

    expect(isDisabled()).toBe(false);
  });
});
