import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
  selector: 'app-dataset-resource-map',
  templateUrl: './dataset-resource-map.component.html',
})
export class DatasetResourceMapComponent implements OnInit {
  /**
   * Resource id
   */
  resourceId: string;

  /**
   * @ignore
   */
  constructor(private route: ActivatedRoute) {}

  /**
   * Set resource ID
   */
  ngOnInit() {
    this.resourceId = this.route.parent.snapshot.params.resourceId;
  }
}
