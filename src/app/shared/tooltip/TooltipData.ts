import { InjectionToken } from '@angular/core';

export interface TooltipData {
    text: string;
    title: string;
}

export const TOOLTIP_DATA: InjectionToken<TooltipData> = new InjectionToken<TooltipData>('TOOLTIP_DATA');
