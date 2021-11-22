import { NgModule } from '@angular/core';
import {FeatureFlagsModule} from '@app/shared/feature-flags/feature-flags.module';
import { TranslateModule } from '@ngx-translate/core';

import { InfoTooltipComponent } from '@app/shared/info-tooltip/info-tooltip.component';
import { InfoTooltipDirective } from '@app/shared/info-tooltip/info-tooltip.directive';
import { TooltipWithTitleComponent } from '@app/shared/large-tooltip/tooltip-with-title.component';
import { TooltipDirective } from '@app/shared/tooltip/tooltip.directive';

@NgModule({
  imports: [TranslateModule.forChild(), FeatureFlagsModule],
  declarations: [TooltipDirective, InfoTooltipDirective, InfoTooltipComponent, TooltipWithTitleComponent],
  exports: [TooltipDirective, InfoTooltipDirective, InfoTooltipComponent, TooltipWithTitleComponent],
})
export class TooltipModule {}
