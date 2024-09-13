import { Component, EventEmitter, Input, Output } from '@angular/core';
import { toggleVertically } from '@app/animations';
import {
  IAggregationProperties,
  IAggregationPropertiesForRegions,
  MultiselectOption,
  SingleselectOptionForRegions,
} from '@app/services/models/filters';

/**
 * Multiselect which options are expandable
 */
@Component({
  selector: 'app-expandable-multiselect',
  templateUrl: './expandable-multiselect.component.html',
  animations: [toggleVertically],
})
export class ExpandableMultiselectComponent {
  /**
   * flag to determine if option list is expanded
   */
  isExpanded = false;
  /**
   * shows how many options are chosen
   */
  selectedCount = 0;
  /**
   * filtered options after user type in input
   */
  filteredOptions: IAggregationProperties[] = [];
  /**
   * total available options
   */
  totalOptions: IAggregationProperties[] = [];
  /**
   * selected Options
   */
  selectedData: MultiselectOption | SingleselectOptionForRegions;

  /**
   * is filter body visible
   */
  isCollapsed = false;

  /**
   * aria label
   */
  @Input() ariaLabel: string = null;

  /**
   * when options change it creates copy for filtered options and total options
   * @param {IAggregationProperties[]} options
   */
  @Input() set options(options: IAggregationProperties[]) {
    this.totalOptions = options;
    this.filteredOptions = options;
  }

  /**
   * when selected Ids (keys) of options change then selectedData is being updated and count of it
   * @param {MultiselectOption} data
   */
  @Input() set selectedIds(data: MultiselectOption | SingleselectOptionForRegions) {
    this.selectedData = data;
    this.selectedCount = data && Object.keys(data).length;
  }

  /**
   * original selected options before any changes
   */
  @Input() originalSelected: MultiselectOption;

  /**
   * filter title to translate
   */
  @Input() titleTranslationKey: string;

  /**
   * filter tooltip title to translate
   */
  @Input() titleTooltipTranslationKey: string;

  /**
   * shows divider below component
   */
  @Input() showDivider = true;

  /**
   * shows search input
   */
  @Input() showSearchInput = true;

  /**
   * displays show more button
   */
  @Input() displayShowMore = true;

  /**
   * max lenght for input
   */
  @Input() maxLength;

  /**
   * value that should be displayed
   */
  @Input() displayValue = 'title';

  /**
   * placeholder for search input
   */
  @Input() placeholderTranslationKey = 'Action.Search';

  /**
   * shows enable apply element
   */
  @Input() enableApply = false;

  /**
   * set filter name for automatic test
   */
  @Input() filterName: string;

  /**
   * don't show multiselect-list if is geodata search filter
   */
  @Input() isGeodataSearch = false;

  @Input() showHideMapButton = false;

  /**
   * initial value for region input (after refresh if exists)
   */
  @Input() initialValue: string;

  /**
   * event emitter for changing of selected filters
   */
  @Output() selectedChange = new EventEmitter<IAggregationProperties | IAggregationPropertiesForRegions>();

  /**
   * event emitter for applying changes
   */
  @Output() applyFilter = new EventEmitter<void>();

  /**
   * sends new selected option
   * @param {IAggregationProperties | IAggregationPropertiesForRegions} option
   */
  selectItem(option: IAggregationProperties | IAggregationPropertiesForRegions) {
    this.selectedChange.emit(option);
  }

  /**
   * input value has changed
   * @param {string} value
   */
  searchChanged(value: string) {
    if (!this.totalOptions) {
      return;
    }
    if (value) {
      this.isExpanded = true;
    }

    if (this.showSearchInput) {
      this.filteredOptions = value ? this.performFilter(value) : [...this.totalOptions];
    } else {
      this.filteredOptions = [...this.totalOptions];
    }
  }

  /**
   * sends apply events
   */
  triggerApply() {
    this.applyFilter.emit();
  }

  /**
   * filter options by provided value
   * @param {string} filterBy
   */
  private performFilter(filterBy: string) {
    let value;
    return this.totalOptions.filter((item: IAggregationProperties) => {
      value = item[this.displayValue] ? item[this.displayValue] : item;
      return value.toLowerCase().indexOf(filterBy.toLowerCase()) !== -1;
    });
  }
}
