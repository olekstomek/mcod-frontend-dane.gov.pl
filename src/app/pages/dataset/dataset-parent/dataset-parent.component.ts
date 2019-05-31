import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

/**
 * Dataset Parent Component
 */
@Component({
    selector: 'app-dataset-parent',
    templateUrl: './dataset-parent.component.html'
})
export class DatasetParentComponent implements OnInit {

    /**
     * Dataset  of dataset parent component
     */
    dataset;

    /**
     * @ignore
     */
    constructor(private activatedRoute: ActivatedRoute) {}

    /**
     * Initializes dataset.
     */
    ngOnInit() {
        this.dataset = this.activatedRoute.snapshot.data.post.data;
        this.dataset.attributes['tags'] = this.dataset.attributes['tags'] ? this.dataset.attributes['tags'].join(', ') : '';
    }
}
