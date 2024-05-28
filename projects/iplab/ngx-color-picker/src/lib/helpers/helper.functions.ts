import { Color, ColorString } from './color.class';
import { ColorType } from './control.class';


export function getValueByType(color: Color, type: ColorType): string {
    switch (type) {
        case ColorType.hex:
            return color.toHexString();
        case ColorType.hexa:
            return color.toHexString(true);
        case ColorType.rgb:
            return color.toRgbString();
        case ColorType.rgba:
            return color.toRgbaString();
        case ColorType.hsl:
            return color.toHslString();
        case ColorType.hsla:
            return color.toHslaString();
        default:
            return color.toRgbaString();
    }
}

export function isColorEqual(first: Color, second: Color): boolean;
export function isColorEqual(first: ColorString, second: ColorString): boolean;
export function isColorEqual(first: Color | ColorString, second: Color | ColorString): boolean {
    if (first instanceof Color && second instanceof Color) {
        return first.equal(second);
    }
    return first === second;
}