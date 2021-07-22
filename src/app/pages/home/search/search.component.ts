import { NgForm } from '@angular/forms';
import { Router } from '@angular/router';
import { Component } from '@angular/core';
import { APP_CONFIG } from '@app/app.config';

/**
 * Search Component
 */
@Component({
	selector: 'home-search',
	templateUrl: './search.component.html'
})
export class SearchComponent  {

    /**
     * Max length of search input
     */
    maxLength = APP_CONFIG.searchInputMaxLength;

    /**
     * @ignore
     */
	constructor(private router: Router) {}

	/**
     * Redirects to dataset list's page to display query (if provided) results
     * @param form
     */
    search(form: NgForm){
		if(form.value.query)
			this.router.navigate(['/dataset'], {queryParams: { q: form.value.query } });
		else
			this.router.navigate(['/dataset']);

	}

}
