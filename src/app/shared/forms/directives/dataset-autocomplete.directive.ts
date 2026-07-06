import { Directive, ElementRef, Renderer2, inject, output, signal } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { Subject } from 'rxjs';
import { debounceTime, distinctUntilChanged, switchMap } from 'rxjs/operators';
import { ApiModel } from '@app/services/api/api-model';
import { SearchService } from '@app/services/search.service';
import { StringHelper } from '@app/shared/helpers/string.helper';

interface Dataset {
  attributes: {
    title: string;
  };
  id: string;
}

interface SearchResponse {
  data: Dataset[];
}

type SearchParams = Record<string, string | number>;

let dropdownIdCounter = 0;

@Directive({
  selector: '[appDatasetAutocomplete]',
  host: {
    '(document:click)': 'onDocumentClick($event)',
    '(keyup)': 'onKeyUp($event)',
    '(keydown.enter)': '$event.preventDefault()',
    'aria-autocomplete': 'list',
    'aria-haspopup': 'listbox',
    '[attr.aria-expanded]': 'dropdownOpen()',
  },
  standalone: true,
})
export class DatasetAutocompleteDirective {
  private readonly elementRef = inject<ElementRef<HTMLInputElement>>(ElementRef);
  private readonly renderer = inject(Renderer2);
  private readonly searchService = inject(SearchService);

  readonly datasetSelected = output<{ id: string; title: string } | null>();

  private readonly searchChanged = new Subject<SearchParams>();
  private dropdownItemClickListeners: (() => void)[] = [];

  protected readonly dropdownOpen = signal(false);

  constructor() {
    this.searchChanged
      .pipe(
        distinctUntilChanged(),
        debounceTime(400),
        switchMap((params) =>
          this.searchService.search({
            ...params,
            'model[terms]': ApiModel.DATASET,
          }),
        ),
        takeUntilDestroyed(),
      )
      .subscribe((response: SearchResponse) => {
        this.removeDropdownMenu();

        if (!response.data?.length) return;

        const dropdown = this.createDropdownMenu();
        for (const dataset of response.data) {
          this.renderer.appendChild(dropdown, this.createDropdownMenuItem(dataset));
        }
      });
  }

  protected onDocumentClick(event: MouseEvent): void {
    if (event.target !== this.elementRef.nativeElement && this.dropdownOpen()) {
      this.datasetSelected.emit(null);
      this.removeDropdownMenu();
    }
  }

  protected onKeyUp(event: KeyboardEvent): void {
    const isRelevantKey = event.key === 'Backspace' || (event.key.length === 1 && /[a-z0-9]/i.test(event.key));

    if (!isRelevantKey) return;

    const inputValue = (event.target as HTMLInputElement).value.trim();

    if (inputValue.length > 2) {
      this.searchChanged.next({
        page: 1,
        per_page: 10,
        q: inputValue,
        sort: 'relevance',
      });
    } else {
      this.removeDropdownMenu();
    }
  }

  private createDropdownMenu(): HTMLElement {
    const dropdownId = `autocomplete-listbox-${++dropdownIdCounter}`;

    const dropdown: HTMLElement = this.renderer.createElement('div');
    this.renderer.setAttribute(dropdown, 'id', dropdownId);
    this.renderer.setAttribute(dropdown, 'role', 'listbox');
    this.renderer.addClass(dropdown, 'dropdown-menu');
    this.renderer.addClass(dropdown, 'show');
    this.renderer.setStyle(dropdown, 'position', 'absolute');
    this.renderer.setStyle(dropdown, 'top', '40px');
    this.renderer.setStyle(dropdown, 'left', '0px');
    this.renderer.appendChild(this.elementRef.nativeElement.parentElement, dropdown);
    this.renderer.setAttribute(this.elementRef.nativeElement, 'aria-controls', dropdownId);

    this.dropdownOpen.set(true);

    return dropdown;
  }

  private removeDropdownMenu(): void {
    const parent = this.elementRef.nativeElement.parentElement;
    const dropdownMenu = parent?.querySelector('[role="listbox"]');

    if (dropdownMenu) {
      this.dropdownItemClickListeners.forEach((unlisten) => unlisten());
      this.dropdownItemClickListeners = [];
      this.renderer.removeChild(parent, dropdownMenu);
    }

    this.renderer.removeAttribute(this.elementRef.nativeElement, 'aria-controls');
    this.dropdownOpen.set(false);
  }

  private createDropdownMenuItem(dataset: Dataset): HTMLElement {
    const title = StringHelper.stripHtmlTags(dataset.attributes.title);

    const button: HTMLElement = this.renderer.createElement('button');
    this.renderer.setProperty(button, 'type', 'button');
    this.renderer.setAttribute(button, 'role', 'option');
    this.renderer.addClass(button, 'dropdown-item');
    this.renderer.appendChild(button, this.renderer.createText(title));

    const unlisten = this.renderer.listen(button, 'click', () => {
      this.datasetSelected.emit({ id: dataset.id, title });
      this.removeDropdownMenu();
    });

    this.dropdownItemClickListeners.push(unlisten);

    return button;
  }
}
