import { Color, ColorString } from './color.class';
import { ColorType } from './control.class';


export function getValueByType(color: Color, type: ColorType): string {
    const showAlpha = type == ColorType.hexa
                    || type == ColorType.rgba
                    || type == ColorType.hsla
                    || color.getHsva().alpha <= 0.995;

    switch (type) {
        case ColorType.hex:
        case ColorType.hexa:
            return color.toHexString(showAlpha);
        case ColorType.rgb:
        case ColorType.rgba:
            if (!showAlpha) {
                return color.toRgbString();
            }
            return color.toRgbaString();
        case ColorType.hsl:
        case ColorType.hsla:
            if (!showAlpha) {
                return color.toHslString();
            }
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