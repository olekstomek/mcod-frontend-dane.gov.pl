import { Component, Inject, Input, OnInit, Optional } from '@angular/core';

import { TooltipData, TOOLTIP_DATA } from '@app/shared/tooltip/TooltipData';
import { FeatureFlagService } from '@app/services/feature-flag.service';

/**
 * Tooltip with title component
 */
@Component({
  selector: 'app-tooltip-with-title',
  templateUrl: './tooltip-with-title.component.html',
})
export class TooltipWithTitleComponent implements OnInit {
  /**
   * Tooltip title
   * @type {string}
   */
  @Input()
  title: string;
  /**
   * Tooltip text
   * @type {string}
   */
  @Input()
  text: string;
  /**
   * show star rating data openness
   * @type {number}
   */
  @Input() levelDataOpenness: number;

  /**
   * default star rating
   */
  max = 5;

  /**
   * @ignore
   */
  ratesArr: number[] = [];

  /**
   * @ignore
   */
  constructor(@Optional() @Inject(TOOLTIP_DATA) public componentData: TooltipData, private featureFlagService: FeatureFlagService) {}

  /**
   * Setups component data
   */
  ngOnInit() {
    this.title = this.title || this.componentData?.title;
    this.text = this.text || this.componentData?.text;

    if (this.featureFlagService.validateFlagSync('S41_opennes_score_in_tooltip.fe')) {
      if (this.componentData?.levelDataOpenness) {
        this.addStarRatingDataOpenness();
      }
    }
  }

  /**
   * Setups star rating if its file data openness
   */
  addStarRatingDataOpenness() {
    this.levelDataOpenness = this.levelDataOpenness || this.componentData?.levelDataOpenness;

    for (let i = 0; i < this.max; i++) {
      this.ratesArr.push(i + 1);
    }
  }
}
