import { Component, Input } from '@angular/core';

/**
 * Component which displays notes
 */
@Component({
  selector: 'app-notes',
  templateUrl: './notes.component.html',
})
export class NotesComponent {
  /**
   * notes data to display
   */
  @Input() notes: string;
}
