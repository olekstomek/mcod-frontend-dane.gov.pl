import { Component, Input } from '@angular/core';

import { StringHelper } from '@app/shared/helpers/string.helper';

/**
 * Footer Nav List Component
 */
@Component({
  selector: 'app-footer-nav-list',
  templateUrl: './footer-nav-list.component.html',
})
export class FooterNavListComponent {
  /**
   * Title to display
   */
  @Input() titleTranslationKey: string;

  /**
   * Is navigation list visible
   */
  isVisible = false;

  /**
   * Randomly generated id for every navigation list
   */
  listId = StringHelper.generateRandomHex();

  /**
   * Randomly generated id for every list title
   */
  titleId = StringHelper.generateRandomHex();
}
