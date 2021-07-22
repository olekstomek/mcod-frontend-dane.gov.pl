import {Component, Input, OnInit} from '@angular/core';
import {WidgetAbstractComponent} from '@app/shared/cms/widget/widget.abstract.component';

@Component({
  selector: 'cms-slogan',
  templateUrl: './slogan.component.html'
})
export class SloganComponent extends WidgetAbstractComponent implements OnInit {


  ngOnInit() {
  }

}
