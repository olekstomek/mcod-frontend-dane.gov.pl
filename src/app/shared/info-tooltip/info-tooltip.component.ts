import { Component, Input } from '@angular/core';

import { StringHelper } from '../helpers/string.helper';

@Component({
  selector: 'app-info-tooltip',
  templateUrl: './info-tooltip.component.html',
})
export class InfoTooltipComponent {
  /**
   * Tooltip text
   * @type {string}
   */
  @Input()
  text: string;

  /**
   * Tooltip title
   * @type {string}
   */
  @Input()
  title: string;

  /**
   * Tooltip icon color
   * @type {string}
   */
  @Input()
  iconColor: string;

  /**
   * Unique id
   */
  uniqueId = StringHelper.generateRandomHex();
}
