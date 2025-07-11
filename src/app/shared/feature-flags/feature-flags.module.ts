import { NgModule } from '@angular/core';
import { TranslateModule } from '@ngx-translate/core';

import { FeatureFlagDirective } from '@app/shared/feature-flags/feature-flag.directive';

@NgModule({
  imports: [TranslateModule.forChild()],
  declarations: [FeatureFlagDirective],
  exports: [FeatureFlagDirective],
})
export class FeatureFlagsModule {}
