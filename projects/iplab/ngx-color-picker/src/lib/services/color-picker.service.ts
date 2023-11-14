import { Injectable, InjectionToken } from "@angular/core";


export interface IColorPickerConfig {
    indicatorTitle: string;
    presetsTitle: string;
}

@Injectable()
export class ColorPickerConfig implements IColorPickerConfig {
    public indicatorTitle: string = 'Copy color to clipboard';
    public presetsTitle: string = '{0}. Long-click to show alternate shades.';
}

export const COLOR_PICKER_CONFIG = new InjectionToken<IColorPickerConfig>('COLOR_PICKER_CONFIG');