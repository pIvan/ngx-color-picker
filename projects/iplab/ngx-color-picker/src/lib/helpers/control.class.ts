import { Color, ColorString } from './color.class';
import { Subject, BehaviorSubject } from 'rxjs';
import { distinctUntilChanged } from 'rxjs/operators';
import { Rgba } from './rgba.class';
import { Hsla } from './hsla.class';
import { Hsva } from './hsva.class';

export enum ColorType {
    hex = 'hex',
    hexa = 'hexa',
    rgba = 'rgba',
    rgb = 'rgb',
    hsla = 'hsla',
    hsl = 'hsl',
    cmyk = 'cmyk'
}

export class ColorPickerControl {

    private modelValue: Color = null;
    private initValue: Color = null;
    private readonly valueChanged: Subject<Color> = new Subject();

    public readonly presetsVisibilityChanges: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public initType: ColorType = null;
    public readonly alphaChannelVisibilityChanges: BehaviorSubject<boolean> = new BehaviorSubject(true);
    public readonly valueChanges = this.valueChanged.asObservable().pipe(distinctUntilChanged((x, y) => x.toRgbaString() == y.toRgbaString()));

    private colorPresets: Array<Array<Color> | Color> = [];

    constructor() {
        const color = Color.from(new Rgba(255, 0, 0, 1));
        this.setValue(color);
    }

    public setValueFrom(color: ColorString | Color | Rgba | Hsla | Hsva): this {
        const newColor = Color.from(color);
        if (!this.initValue) {
            this.initValue = Color.from(color);
        }

        if (typeof color === 'string' && !this.initType) {
            this.initType = this.finOutInputType(color);
        }
        this.setValue(newColor);
        return this;
    }

    public get value(): Color {
        return this.modelValue;
    }

    /**
     * @internal
     * used for two-way data binding
     */
    public set value(value: Color) {
        this.setValue(value);
    }

    /**
     * reset color to initial
     */
    public reset(): this {
        const color = !this.initValue ?
            Color.from(new Rgba(255, 0, 0, 1)) :
            this.initValue.clone();
        this.setValue(color);
        return this;
    }

    public isAlphaChannelEnabled(): boolean {
        return this.alphaChannelVisibilityChanges.value;
    }

    public showAlphaChannel(): this {
        this.alphaChannelVisibilityChanges.next(true);
        return this;
    }

    public hideAlphaChannel(): this {
        this.alphaChannelVisibilityChanges.next(false);
        return this;
    }

    public getColorType(colorString: ColorString): ColorType {
        return this.finOutInputType(colorString);
    }

    public setColorPresets(colorPresets: Array<Array<ColorString> | ColorString>): this {
        this.colorPresets = this.setPresets(colorPresets);
        return this;
    }

    public get presets() {
        return this.colorPresets;
    }

    public hasPresets(): boolean {
        return this.colorPresets.length > 0;
    }

    public isPresetVisible(): boolean {
        return this.presetsVisibilityChanges.value;
    }

    public showPresets(): this {
        this.presetsVisibilityChanges.next(true);
        return this;
    }

    public hidePresets(): this {
        this.presetsVisibilityChanges.next(false);
        return this;
    }

    private setValue(value: Color): this {
        this.modelValue = value;
        this.valueChanged.next(value);
        return this;
    }

    private finOutInputType(colorString: ColorString): ColorType {
        const str = colorString.replace(/ /g, '').toLowerCase();
        if (str[0] === '#') {
            if (str.length > 7) {
                return ColorType.hexa;
            }
            return ColorType.hex;
        }

        const OpenParenthesis = str.indexOf('(');
        const colorTypeName = str.substr(0, OpenParenthesis);
        switch (colorTypeName) {
            case ColorType.rgba:
                return ColorType.rgba;
            case ColorType.rgb:
                return ColorType.rgb;
            case ColorType.hsla:
                return ColorType.hsla;
            case ColorType.hsl:
                return ColorType.hsl;
            case ColorType.cmyk:
                return ColorType.cmyk;
        }
        return null;
    }

    private setPresets(colorPresets: Array<Array<ColorString> | ColorString>): Array<Color> {
        const presets = [];

        for (const color of colorPresets) {
            if (Array.isArray(color)) {
                presets.push(this.setPresets(color));
            } else {
                presets.push(new Color(color));
            }
        }
        return presets;
    }
}
