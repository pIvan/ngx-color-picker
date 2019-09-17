import { Color } from './color.class';
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
