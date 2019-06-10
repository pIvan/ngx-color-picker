
export interface IColorPickerConfig {
    indicatorTitle: string;
    presetsTitle: string;
}

export class ColorPickerConfig implements IColorPickerConfig {
    public indicatorTitle: string = 'Copy color to clipboard';
    public presetsTitle: string = '{0}. Long-click to show alternate shades.';
}
