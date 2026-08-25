import { Injectable, signal, WritableSignal } from '@angular/core';
import { AsyncSubject } from 'rxjs';
import { switchMap, tap } from 'rxjs/operators';

import { ApiFlagsService } from '@app/services/api-flags.service';
import { IFeatureFlag } from '@app/services/models/feature-flag';
import { ApplicationHostnameStrategyService } from '@app/services/unleash-strategies/application-hostname-strategy.service';
import { EnvironmentNameStrategyService } from '@app/services/unleash-strategies/environment-name-strategy.service';
import { StrategiesEnum } from '@app/services/unleash-strategies/strategies-enum';

@Injectable({
  providedIn: 'root',
})
export class FeatureFlagService {
  featureFlags = new AsyncSubject();

  featureFlagsList: WritableSignal<IFeatureFlag[] | null> = signal(null);

  /**
   * @Ignore
   */
  constructor(
    private environmentNameStrategyService: EnvironmentNameStrategyService,
    private applicationHostnameStrategyService: ApplicationHostnameStrategyService,
    private apiFlagsService: ApiFlagsService,
  ) {}

  /**
   * Initialize service: register client and load flags. Flags are loaded asynchronously only once at application start.
   */
  initialize(): Promise<IFeatureFlag[]> {
    return this.apiFlagsService
      .registerClient(this.featureFlags)
      .pipe(
        switchMap(() => this.featureFlags),
        tap((flags: IFeatureFlag[]) => this.featureFlagsList.set(flags)),
      )
      .toPromise();
  }

  /**
   * Search feature flag and validate its status and strategies
   * @param {string} flagName
   * @param {IFeatureFlag[]}flagList
   * @return {boolean}
   */
  validateFlag(flagName: string, flagList: IFeatureFlag[]): boolean {
    const flag = flagList.find((f) => f.name === flagName);
    return !!flag?.enabled && this.checkStrategies(flag);
  }

  /**
   * Search feature flag and validate its status and strategies
   * @param {string} flagName
   * @return {boolean}
   */
  validateFlagSync(flagName: string): boolean {
    const flag = this.featureFlagsList()?.find((f) => f.name === flagName);
    return !!flag?.enabled && this.checkStrategies(flag);
  }

  /**
   * Iterates over flag's strategies and checks them.
   * @param {IFeatureFlag} flag
   * @return {boolean}
   */
  private checkStrategies(flag: IFeatureFlag): boolean {
    return flag.strategies.every((strategy) => {
      switch (strategy.name) {
        case StrategiesEnum.defaultStrategy:
          return true;
        case StrategiesEnum.envName:
          return this.environmentNameStrategyService.validateStrategy(strategy.parameters.envNames);
        case StrategiesEnum.hostName:
          return this.applicationHostnameStrategyService.validateStrategy(strategy.parameters.hostNames);
        default:
          return false;
      }
    });
  }
}
