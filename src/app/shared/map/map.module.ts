import { CommonModule } from '@angular/common';
import { NgModule } from '@angular/core';
import { SharedModule } from '@app/shared/shared.module';
import { TranslateModule, TranslateParser } from '@ngx-translate/core';
import { TranslateICUParser } from 'ngx-translate-parser-plural-select';

import { MapOptionsComponent } from '@app/shared/map/map-options/map-options.component';
import { MapComponent } from '@app/shared/map/map.component';
import { SliderComponent } from '../slider/slider.component';
import { FormsModule } from '@angular/forms';


@NgModule({
    declarations: [
        MapComponent,
        MapOptionsComponent,
        SliderComponent
    ],
    exports: [
        MapComponent,
        MapOptionsComponent,
        SliderComponent
    ],
    imports: [
        FormsModule,
        CommonModule,
        TranslateModule.forChild({
            parser: {
                provide: TranslateParser,
                useClass: TranslateICUParser
            }
        }),
        SharedModule,
    ]
})
export class MapModule {
}
