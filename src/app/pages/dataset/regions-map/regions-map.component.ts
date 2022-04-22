import { DOCUMENT } from '@angular/common';
import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Inject,
  Input,
  OnChanges,
  OnDestroy,
  OnInit,
  Optional,
  Output,
  ViewChild,
} from '@angular/core';
import { LatLngBounds, Map, Marker, Rectangle } from 'leaflet';

import { ApiModel } from '@app/services/api/api-model';
import { DatasetService } from '@app/services/dataset.service';
import { LeafletService } from '@app/services/leflet.service';
import { IAggregation, IAggregationArray } from '@app/services/models/map';
import { Subject, Subscription } from 'rxjs';
import { debounceTime, first, switchMap } from 'rxjs/operators';

@Component({
  selector: 'app-regions-map',
  templateUrl: './regions-map.component.html',
})
export class RegionsMapComponent implements OnInit, AfterViewInit, OnDestroy, OnChanges {
  /**
   * API model
   */
  apiModel = ApiModel;

  /**
   * Link to API
   */
  selfApi: string;

  /**
   * Map instance
   */
  map: Map;

  /**
   * Clusters grid - aggregations
   */
  aggregationsGrid: IAggregation[];

  /**
   * Map properties and parameters
   */
  mapBounds: LatLngBounds;
  mapBoundsString: string;
  actualZoom = 2;
  clustersLayer = this.leafletService.layerGroup();
  aggregationClustersLayer = this.leafletService.layerGroup();
  mapOptions = {
    attribution: 'Map data &copy; <a href="https://www.openstreetmap.org/">OpenStreetMap</a> contributors',
    maxZoom: 19,
    minZoom: 3,
  };
  leafletOptions = {
    layers: [this.leafletService.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', this.mapOptions)],
    worldCopyJump: true,
  };

  /**
   * Default styles for map objects
   */
  circleAggregationStyle = {
    weight: 15,
    opacity: 0.4,
    className: 'clusterCircle',
    radius: undefined,
    fill: true,
    fillColor: '#0f2648',
    fillOpacity: 0.8,
  };

  rectangleStyle = {
    color: '#50a6ff',
    weight: 1,
  };

  /**
   * Marker properties
   */
  markerProperties = {
    icon: this.leafletService.icon({
      iconUrl: 'assets/icomoon/SVG/pin-pop.svg',
      className: 'smallPin',
    }),
    keyboard: false,
  };

  /**
   * Emergency Poland bounds in case of api failures
   */
  polandBounds = {
    bottom_right: [24, 49],
    top_left: [14, 55],
  };

  /**
   * mark on center of boundary box
   */
  centerPoint;

  /**
   * boundary box for first open map
   */
  rectangle: Rectangle;

  /**
   * pin on map
   */
  marker: Marker;

  /**
   * Map Event
   */
  mapEvent: Subscription;

  /**
   * marker Event
   */
  markerEvent: Subscription;

  /**
   * Rxjs Wrapper for Map Event
   */
  rxjsWrapperForMapEvent = {
    observable: function (types) {
      const subject = new Subject();
      this.on(types, event => subject.next(event));
      return subject;
    },
  };

  refreshMapButton = false;

  /**
   * dataset
   */
  @Input() item: any;

  /**
   * aggregation array
   */
  @Input() aggregations: IAggregationArray;

  /**
   * sort option to search request
   */
  @Input() sortOption: string;

  /**
   * refresh map after user chose a new location
   */
  @Input() refresh: any;

  /**
   * emit to hide map button click
   */
  @Output() hideMap = new EventEmitter<boolean>();

  /**
   * emit button click with new dataset from boundary box
   */
  @Output() datasetFromMap = new EventEmitter<any>();

  /**
   * Map container reference
   */
  @ViewChild('mapRef') mapRef: ElementRef;

  constructor(
    private datasetService: DatasetService,
    @Optional() private leafletService: LeafletService,
    @Inject(DOCUMENT) private document: Document,
  ) {}

  ngOnInit(): void {
    this.setMapBounds();
  }

  ngOnDestroy(): void {
    this.mapEvent.unsubscribe();
    this.markerEvent.unsubscribe();
  }

  ngOnChanges(): void {
    this.refresh.pipe(first()).subscribe(resp => {
      if (resp) {
        this.setMapBounds();
        this.clustersLayer.clearLayers();
        this.aggregationClustersLayer.clearLayers();
        this.setBBoxAndMarker();
        this.prepareDataForMap(this.aggregations);
        this.setMarkerEvent();
      }
    });
  }

  /**
   * Add new map, set boundaries based on dataset
   */
  ngAfterViewInit(): void {
    this.map = this.leafletService.createMap(this.mapRef, this.leafletOptions);
    this.setBBoxAndMarker();
    this.map.addLayer(this.clustersLayer);
    this.actualZoom = this.map.getZoom();
    this.leafletService.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', this.mapOptions).addTo(this.map);
    this.prepareDataForMap(this.aggregations);
    this.leafletService.eventedInclude(this.rxjsWrapperForMapEvent);
    this.setMapEvent();
    this.setMarkerEvent();
  }

  /**
   * set to map bbox, marker and add to layer group
   */
  setBBoxAndMarker(): void {
    this.map.fitBounds(this.mapBounds);
    this.rectangle = this.leafletService.rectangle(this.mapBounds, this.rectangleStyle).addTo(this.map);
    this.centerPoint = this.map.getCenter();
    this.marker = this.leafletService.marker(this.centerPoint, this.markerProperties).addTo(this.map);
    this.clustersLayer.addLayer(this.rectangle).addLayer(this.marker);
  }

  setMapEvent(): void {
    this.mapEvent = this.map['observable']('moveend').subscribe(() => {
      if (!this.refreshMapButton) {
        this.refreshMapButton = true;
      }
    });
  }

  setMarkerEvent(): void {
    this.markerEvent = this.marker['observable']('click').subscribe(() => {
      this.setMapBounds();
      this.map.fitBounds(this.mapBounds);
    });
  }

  /**
   * button click to close map
   */
  onCloseMap(): void {
    this.hideMap.emit(true);
  }

  /**
   * button click to get data and refresh map
   */
  onRefreshMap(): void {
    this.actualZoom = this.map.getZoom();
    this.mapBounds = this.map.getBounds();
    this.mapBoundsString = this.setMapBoundsString();
    this.datasetService.getDataFromBBox(this.mapBoundsString, this.sortOption).subscribe(resp => {
      this.setMapData(resp);
      this.centerPoint = this.map.getCenter();
    });
  }

  setMapBounds(): void {
    const southWest = this.item.regions[Object.keys(this.item.regions)[0]].bbox[0];
    const northEast = this.item.regions[Object.keys(this.item.regions)[0]].bbox[1];
    this.mapBounds = this.leafletService.latLngBounds([southWest[1], southWest[0]], [northEast[1], northEast[0]]);
  }

  /**
   * create string on boundary box to send to BE
   */
  private setMapBoundsString(): string {
    const density = this.zoomToDensity();
    return `${this.mapBounds.getNorthWest().wrap().lng},${this.mapBounds.getNorthWest().wrap().lat},${
      this.mapBounds.getSouthEast().wrap().lng
    },${this.mapBounds.getSouthEast().wrap().lat},${density}`;
  }

  private setMapData(response: any): void {
    this.datasetFromMap.emit(response);
    if (response.data && !this.aggregationsGrid) {
      this.prepareDataForMap(response.meta.aggregations);
    } else {
      this.clearMapView();
      this.prepareDataForMap(response.meta.aggregations);
    }
  }

  private prepareDataForMap(aggregations: IAggregationArray): void {
    this.aggregationsGrid = aggregations.by_tiles;
    if (this.aggregationsGrid) {
      this.aggregationsGrid.map(aggregation => {
        this.displayAggregationCircles(aggregation);
      });
    }
  }

  private displayAggregationCircles(aggregation: IAggregation): void {
    this.circleAggregationStyle.radius = this.calculateCircleRadius(aggregation.doc_count);
    const aggregationCircle = this.leafletService.circleMarker(
      [aggregation.centroid[1], aggregation.centroid[0]],
      this.circleAggregationStyle,
    );
    const template = `<div class="map-icons-container">\
          <div><img src="assets/icomoon/SVG/zbior-danych.svg" /> ${aggregation.datasets_count} zbiory danych</div>\
          <div><img src="assets/icomoon/SVG/dane.svg" /> ${aggregation.resources_count} dane</div></div>`;
    aggregationCircle.bindTooltip(`${aggregation.doc_count}`, {
      permanent: true,
      direction: 'center',
      opacity: 1,
      zoomAnimation: true,
      className: 'clusterText',
    });
    aggregationCircle.bindPopup(template, { closeButton: false, minWidth: 200, closeOnClick: false });
    aggregationCircle.addEventListener('mouseover', function () {
      aggregationCircle.openPopup();
    });
    aggregationCircle.addEventListener('mouseout', function () {
      aggregationCircle.closePopup();
    });
    this.aggregationClustersLayer.addLayer(aggregationCircle);
    this.aggregationClustersLayer.addTo(this.map);
  }

  private calculateCircleRadius(count: number): number {
    if (count < 10) {
      return 15;
    } else if (count >= 10 && count < 49) {
      return 20;
    } else if (count >= 50 && count < 99) {
      return 25;
    } else if (count >= 100 && count < 499) {
      return 27;
    } else if (count >= 500 && count < 999) {
      return 31;
    } else if (count >= 1000 && count < 4999) {
      return 33;
    } else if (count >= 5000 && count < 9999) {
      return 35;
    } else if (count >= 10000 && count < 14999) {
      return 37;
    } else if (count >= 15000 && count < 19999) {
      return 40;
    } else if (count >= 20000) {
      return 40;
    }
  }

  private clearMapView(): void {
    const allCircles = Array.from(this.document.querySelectorAll('.clusterCircle.leaflet-interactive'));
    allCircles.map(path => {
      path.parentNode.removeChild(path);
    });
    const allLabels = Array.from(this.document.querySelectorAll('.clusterText'));
    allLabels.map(path => {
      path.parentNode.removeChild(path);
    });
    /*const allMarkers = Array.from(this.document.querySelectorAll('.leaflet-marker-icon'));
    allMarkers.map(path => {
      path.parentNode.removeChild(path);
    });
    const allObjects = Array.from(this.document.querySelectorAll('.leaflet-interactive'));
    allObjects.filter(element => !element.classList.contains('distanceCircle')).map(element => element.parentNode.removeChild(element));*/
  }

  private zoomToDensity(): number {
    let density;
    switch (this.actualZoom) {
      case 3:
      case 4:
      case 5:
        density = 2;
        break;
      default:
        density = 3;
    }
    return density;
  }
}
