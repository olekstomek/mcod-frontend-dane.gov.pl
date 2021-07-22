import { Component, Input, OnInit } from '@angular/core';
import { ApiConfig } from '@app/services/api';

@Component({
    selector: 'app-dataset-metadata',
    templateUrl: './dataset-metadata.component.html'
})
export class DatasetMetadataComponent implements OnInit {
    
	/**
	 * Self api url
	 */
	@Input() selfLink: string;
	
	/**
	 * Self api url
	 */
	@Input() datasetId: string;

	/**
	 * Self api to csv catalog
	 */
	selfApiCsv: string;

	/**
	 * Self api to rdf catalog
	 */
	selfApiRdf: string;

	/**
	 * Is list or detail view
	 */
	@Input() islistView = true;

	/**
	 * Initializes metadata access
	 */
	ngOnInit(): void {
		this.setMetadataUrls();
	}
    
	/**
     * Sets metadata urls
     */
    setMetadataUrls() {
		if(!this.selfLink) {
			return;
		}
		
		if (!this.datasetId) {
			const linkSelfArr = this.selfLink.split(ApiConfig.apiVersion);
			this.selfApiRdf = `${linkSelfArr[0]}${ApiConfig.apiVersion}/catalog.rdf`;
			this.selfApiCsv = `${linkSelfArr[0]}${ApiConfig.apiVersion}/datasets/resources/metadata.csv`;
			return;
		}

        const datasetIdIndex = this.selfLink.indexOf(this.datasetId);
        const baseUrl = this.selfLink.substr(0, datasetIdIndex);
        let linkSelf = baseUrl;
        linkSelf = linkSelf.replace('datasets', 'dataset');
        linkSelf = linkSelf.replace(ApiConfig.apiVersion, `${ApiConfig.apiVersion}/catalog`);
        this.selfApiRdf = `${linkSelf}${this.datasetId}.rdf`;
        this.selfApiCsv = baseUrl + `${this.datasetId}/resources/metadata.csv`;
    }
}
