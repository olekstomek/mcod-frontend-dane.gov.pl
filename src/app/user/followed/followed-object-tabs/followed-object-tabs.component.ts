import { Component, OnInit } from '@angular/core';
import { ActivatedRoute } from '@angular/router';

@Component({
    selector: 'app-followed-object-tabs',
    templateUrl: './followed-object-tabs.component.html',
})
export class FollowedObjectTabsComponent implements OnInit {
    
    /**
     * Id of the corresponding tab
     */
    labelledBy: string;
    
    /**
     * @ignore
     */
    constructor(private activatedRoute: ActivatedRoute) {}

    /**
     * Sets aria label
     */
    ngOnInit() {
        this.labelledBy = this.activatedRoute.snapshot.data['labelledBy'];
    }
}

