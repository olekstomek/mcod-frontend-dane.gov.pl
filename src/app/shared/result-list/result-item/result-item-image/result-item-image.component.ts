import { Component, Input } from '@angular/core';

@Component({
  selector: 'app-result-item-image',
  templateUrl: './result-item-image.component.html',
})
export class ResultItemImageComponent {
    /**
    * dataset item to display
    */
    @Input() item: any;
}
