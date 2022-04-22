import { Component, Input } from '@angular/core';
import { toggleHorizontally, toggleVertically } from '@app/animations';
import { StringHelper } from '../helpers/string.helper';

/**
 * Truncated text component with expand/ collapse button
 */
@Component({
  selector: 'collapsible-text',
  templateUrl: './collapsible-text.component.html',
  animations: [toggleVertically],
})
export class CollapsibleTextComponent {
  /**
   * Text do display
   */
  @Input() text: string;

  /**
   * Text do display
   */
  @Input() tags: any;

  /**
   * Truncated text length
   */
  @Input() maxTextLength = 400;

  @Input() isCollapsedDown = false;

  /**
   * Is text collapsed
   */
  isCollapsed = true;

  /**
   * Is notes collapsed
   */
  isCollapsedNotes = false;

  /**
   * Random id
   */
  generatedId = StringHelper.generateRandomHex();
}
