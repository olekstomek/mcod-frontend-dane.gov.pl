import {Component, Input, OnInit} from '@angular/core';

@Component({
  selector: 'link-button',
  templateUrl: './link-button.component.html'
})
export class LinkButtonComponent implements OnInit {

    @Input() labelTranslateKey: string;
    @Input() routerLink: string[];
  constructor() { }

  ngOnInit() {
  }

}
