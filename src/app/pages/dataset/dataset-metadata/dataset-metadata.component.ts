import { LowerCasePipe } from '@angular/common';
import { Component, OnInit, inject, computed, input } from '@angular/core';
import { TranslatePipe, TranslateService } from '@ngx-translate/core';

import { ApiConfig } from '@app/services/api';
import { FeatureFlagDirective } from '@app/shared/feature-flags/feature-flag.directive';
import { FeatureFlagService } from '@app/services/feature-flag.service';

@Component({
  selector: 'app-dataset-metadata',
  templateUrl: './dataset-metadata.component.html',
  standalone: true,
  imports: [TranslatePipe, LowerCasePipe, FeatureFlagDirective],
})
export class DatasetMetadataComponent implements OnInit {
  private readonly translateService = inject(TranslateService);
  private readonly featureFlagService = inject(FeatureFlagService);

  selfLink = input<string>();
  datasetId = input<string>();
  islistView = input<boolean>(true);

  selfApiCsv: string;
  selfApiCsvZip: string;
  selfApiRdf: string;
  selfApiXml: string;
  currentLang: string;

  shouldDownloadMetadataAsZip = computed<boolean>(() =>
    !this.datasetId() ? this.featureFlagService.validateFlagSync('S70_download_metadata_as_zip.fe') : false,
  );

  ngOnInit(): void {
    this.currentLang = this.translateService.currentLang;
    this.setMetadataUrls();
  }

  setMetadataUrls() {
    if (!this.selfLink()) {
      return;
    }

    if (!this.datasetId()) {
      const linkSelfArr = this.selfLink().split(ApiConfig.apiVersion);
      this.selfApiRdf = `${linkSelfArr[0]}${ApiConfig.apiVersion}/catalog.rdf`;
      this.selfApiCsv = `${linkSelfArr[0]}${ApiConfig.apiVersion}/datasets/resources/metadata.csv`;
      this.selfApiCsvZip = `${linkSelfArr[0]}${ApiConfig.apiVersion}/datasets/resources/metadata.zip`;
      this.selfApiXml = `${linkSelfArr[0]}${ApiConfig.apiVersion}/datasets/resources/metadata.xml`;
      return;
    }

    const datasetIdIndex = this.selfLink().indexOf(this.datasetId());
    const baseUrl = this.selfLink().substr(0, datasetIdIndex);
    let linkSelf = baseUrl;
    linkSelf = linkSelf.replace('datasets', 'dataset');
    linkSelf = linkSelf.replace(ApiConfig.apiVersion, `${ApiConfig.apiVersion}/catalog`);
    this.selfApiRdf = `${linkSelf}${this.datasetId()}.rdf`;
    this.selfApiCsv = baseUrl + `${this.datasetId()}/resources/metadata.csv`;
    this.selfApiCsvZip = baseUrl + `${this.datasetId()}/resources/metadata.zip`;
    this.selfApiXml = baseUrl + `${this.datasetId()}/resources/metadata.xml`;
  }
}
