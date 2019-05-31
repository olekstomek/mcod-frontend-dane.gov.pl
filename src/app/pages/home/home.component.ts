import { Component, OnInit } from '@angular/core';
import { SeoService } from '@app/services/seo.service';

/**
 * Home Component
 */
@Component({
    selector: 'app-home',
    templateUrl: './home.component.html'
})
export class HomeComponent implements OnInit {

    /**
     * @ignore
     */
    constructor(private seoService: SeoService) {}

    /**
     * Sets META tags (title). 
     */    
    ngOnInit() {
        this.seoService.setSeoFromTranslation('Home');
    }
}
