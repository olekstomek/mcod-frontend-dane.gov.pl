import { Component, OnDestroy, OnInit } from '@angular/core';
import { Subject } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

import { HighContrastModeEnum, HighContrastService } from '@app/services/high-contrast.service';

@Component({
  selector: 'app-logingovpl-error-page',
  templateUrl: './logingovpl-error-page.component.html',
})
export class LogingovplErrorPageComponent implements OnInit, OnDestroy {
  highContrastMode: HighContrastModeEnum;
  destroy$: Subject<void> = new Subject<void>();

  constructor(private highContrastService: HighContrastService) {}

  ngOnInit() {
    this.highContrastService.getCurrentContrastMode()
      .pipe(takeUntil(this.destroy$))
      .subscribe(mode => this.highContrastMode = mode);
  }

  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }
}
