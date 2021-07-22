import { Component, Input } from "@angular/core";

@Component({
    selector: "app-resource-item-info",
    templateUrl: "./resource-item-info.component.html",
})
export class ResourceItemInfoComponent {
    /**
     * dataset item to display
     */
    @Input() item: any;

    /**
     * determines if created sort param is active
     */
    @Input() isSortParamsCreated = false;

    /**
     * determines if data date sort param is active
     */
    @Input() isSortParamsDataDate = false;

    /**
     * url to compose router link
     */
    @Input() urlNavigation: string;
}
