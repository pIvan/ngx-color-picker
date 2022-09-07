import { Cmyk } from './cmyk.class';
import { Hsla } from './hsla.class';
import { Hsva } from './hsva.class';
import { Rgba } from './rgba.class';
import { ColorsTable } from './colors-table.class';

export type ColorString = string;

export class Color {

    /**
     * base color used to calculate other
     * default color
     * rgb(255, 0, 0)
     * hsl(0, 100%, 50%)
     * #ff0000
     */
    private hsva: Hsva = new Hsva(0, 1, 1, 1);
    private rgba: Rgba = new Rgba(255, 0, 0, 1);

    constructor(colorString?: ColorString) {
        if (colorString) {
            this.stringToColor(colorString);
        }
    }

    public static from(color: ColorString | Color | Hsva | Rgba | Hsla): Color {
        if (typeof color === 'string') {
            return new Color(color);
        } else if (color instanceof Color) {
            return color.clone();
        } else if (color instanceof Rgba) {
            return new Color().setRgba(color.red, color.green, color.blue, color.alpha);
        } else if (color instanceof Hsva) {
            return new Color().setHsva(color.hue, color.saturation, color.value, color.alpha);
        } else if (color instanceof Hsla) {
            return new Color().setHsla(color.hue, color.saturation, color.lightness, color.alpha);
        }

        return null;
    }

    /**
     * make from existing color new color object
     */
    public clone(): Color {
        return Color.from(this.getRgba());
    }

    /**
     * define Color from hex, rgb, rgba, hsl, hsla or cmyk string
     */
    public setFromString(color: ColorString): this {
        return this.stringToColor(color);
    }

    /**
     * define Color from HSV values
     */
    public setHsva(hue: number = null, saturation: number = 100, brightness: number = 100, alpha: number = 1): this {
        if (hue != null) {
            this.hsva.hue = hue;
        }

        if (saturation != null) {
            this.hsva.saturation = saturation;
        }

        if (brightness != null) {
            this.hsva.value = brightness;
        }

        if (alpha != null) {
            alpha = alpha > 1 ? 1 : alpha < 0 ? 0 : alpha;
            this.hsva.alpha = alpha;
        }

        this.rgba = this.hsvaToRgba(this.hsva);
        return this;
    }

    /**
     * define Color from RGBa
     */
    public setRgba(red: number = null, green: number = null, blue: number = null, alpha: number = 1): this {
        if (red != null) {
            this.rgba.red = red;
        }

        if (green != null) {
            this.rgba.green = green;
        }

        if (blue != null) {
            this.rgba.blue = blue;
        }

        if (alpha != null) {
            alpha = alpha > 1 ? 1 : alpha < 0 ? 0 : alpha;
            this.rgba.alpha = alpha;
        }

        this.hsva = this.rgbaToHsva(this.rgba);
        return this;
    }

    /**
     * define Color from HSLa
     */
    public setHsla(hue: number, saturation: number, lightness: number, alpha: number = 1): this {
        if (alpha != null) {
            alpha = alpha > 1 ? 1 : alpha < 0 ? 0 : alpha;
            this.rgba.alpha = alpha;
        }

        const hsla = new Hsla(hue, saturation, lightness, alpha);
        this.rgba = this.hslaToRgba(hsla);
        this.hsva = this.rgbaToHsva(this.rgba);
        return this;
    }

    /**
     * return hexadecimal value formatted as '#341d2a' or '#341d2aFF' if alhpa channel is enabled
     */
    public toHexString(alpha: boolean = false): ColorString {
        /* tslint:disable:no-bitwise */
        let hex = '#' + ((1 << 24) | (this.rgba.getRed() << 16) | (this.rgba.getGreen() << 8) | this.rgba.getBlue()).toString(16).substr(1);
        if (alpha) {
            hex += ((1 << 8) | Math.round(this.rgba.alpha * 255)).toString(16).substr(1);
        }
        /* tslint:enable:no-bitwise */
        return hex.toUpperCase();
    }

    /**
     * return rgba string formatted as rgba(52, 29, 42, 1)
     */
    public toRgbaString(): ColorString {
        return this.rgba.toString();
    }

    /**
     * return rgb string formatted as rgb(52, 29, 42)
     */
    public toRgbString(): ColorString {
        return this.rgba.toString(false);
    }

    /**
     * return hsla string formatted as hsla(327, 29%, 16%, 1)
     */
    public toHslaString(): ColorString {
        return this.getHsla().toString();
    }

    /**
     * return hsl string formatted as hsl(327, 29%, 16%)
     */
    public toHslString(): ColorString {
        return this.getHsla().toString(false);
    }

    /**
     * return hsva string formatted as hsva(327, 29%, 16%, 100%)
     */
    public toHsvaString(): ColorString {
        return this.hsva.toString();
    }

    /**
     * return hsv string formatted as hsv(327, 29%, 16%)
     */
    public toHsvString(): ColorString {
        return this.hsva.toString(false);
    }

    /**
     * return Cmyk string formatted as cmyk(100%, 100%, 100%, 100%)
     */
    public toCmykString(): ColorString {
        return this.getCmyk().toString();
    }

    public getHsva(): Hsva {
        return new Hsva(this.hsva.hue, this.hsva.saturation, this.hsva.value, this.hsva.alpha);
    }

    public getRgba(): Rgba {
        return new Rgba(this.rgba.red, this.rgba.green, this.rgba.blue, this.rgba.alpha);
    }

    public getHsla(): Hsla {
        return this.rgbaToHsla(this.rgba);
    }

    public getCmyk(): Cmyk {
        return this.rgbaToCmyk(this.rgba);
    }

    private hsvaToHsla(color: Hsva): Hsla {
        const hue = color.hue;
        const s = color.saturation / 100;
        const v = color.value / 100;
        const lightness = ((2 - s) * color.value) / 2;
        const saturation = (s * v) / ((lightness <= 1) ? lightness : 2 - lightness) || 0;

        return new Hsla(hue, lightness * 100, saturation * 100, color.alpha);
    }

    private hslaToHsva(color: Hsla): Hsva {
        const hue = color.hue;
        const l = (color.lightness / 100) * 2;
        const s = (color.saturation / 100) * (l <= 1 ? l : 2 - l);
        const value = (l + s) / 2;
        const saturation = (2 * s) / (l + s) || 0;

        return new Hsva(hue, saturation, value, color.alpha);
    }

    private rgbaToHsva(color: Rgba): Hsva {
        const red = color.red / 255;
        const green = color.green / 255;
        const blue = color.blue / 255;
        const alpha = color.alpha;

        const Cmax = Math.max(red, green, blue);
        const Cmin = Math.min(red, green, blue);
        const delta = Cmax - Cmin;

        let hue = 0;
        let saturation: number = Cmax === 0 ? 0 : delta / Cmax;
        let brightness: number = Cmax;

        if (Cmax !== Cmin) {
            switch (Cmax) {
                case red:
                    hue = (green - blue) / delta + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = 2 + (blue - red) / delta;
                    break;
                case blue:
                    hue = 4 + (red - green) / delta;
                    break;
            }
            hue /= 6;
        }

        hue = hue * 360;
        saturation = saturation * 100;
        brightness = brightness * 100;

        return new Hsva(hue, saturation, brightness, alpha);
    }

    private hsvaToRgba(color: Hsva): Rgba {
        let red = 1;
        let green = 0;
        let blue = 0;
        const saturation = color.saturation / 100;
        const brightness = color.value / 100;
        const alpha = color.alpha;
        const hex = color.hue / 60;

        const primary = Math.floor(hex);
        const secoundary = hex - primary;
        const a = (1 - saturation) * brightness;
        const b = (1 - (saturation * secoundary)) * brightness;
        const c = (1 - (saturation * (1 - secoundary))) * brightness;

        switch (primary) {
            case 6:
            case 0: red = brightness; green = c; blue = a; break;
            case 1: red = b; green = brightness; blue = a; break;
            case 2: red = a; green = brightness; blue = c; break;
            case 3: red = a; green = b; blue = brightness; break;
            case 4: red = c; green = a; blue = brightness; break;
            case 5: red = brightness; green = a; blue = b; break;
        }

        red = red * 255;
        green = green * 255;
        blue = blue * 255;

        return new Rgba(red, green, blue, alpha);
    }

    private rgbaToHsla(color: Rgba): Hsla {
        // based on CamanJS
        const red = color.red / 255;
        const green = color.green / 255;
        const blue = color.blue / 255;
        const alpha = color.alpha;

        const max = Math.max(red, green, blue);
        const min = Math.min(red, green, blue);

        let hue = 0;
        let saturation = 0;
        let luminance = (max + min) / 2;
        const delta = max - min;

        if (max !== min) {
            saturation = luminance > 0.5 ? delta / (2.0 - max - min) : delta / (max + min);
            switch (max) {
                case red:
                    hue = (green - blue) / delta + (green < blue ? 6 : 0);
                    break;
                case green:
                    hue = (blue - red) / delta + 2;
                    break;
                case blue:
                    hue = (red - green) / delta + 4;
                    break;
            }

            hue /= 6;
        }

        hue = hue * 360;
        saturation = saturation * 100;
        luminance = luminance * 100;

        return new Hsla(hue, saturation, luminance, alpha);
    }

    /**
     * convert rgb color from HSLa
     *
     * hue = 0 => 360
     * saturation = 0 => 1
     * lightness = 0 => 1
     */
    private hslaToRgba(color: Hsla): Rgba {
        const hue = color.hue / 360;
        const saturation = color.saturation / 100;
        const lightness = color.lightness / 100;
        const alpha = color.alpha;

        let red = lightness;
        let green = lightness;
        let blue = lightness;

        if (saturation !== 0) {
            const q = lightness < 0.5 ? lightness * (1 + saturation) : lightness + saturation - (lightness * saturation);
            const p = 2 * lightness - q;

            red = this.hueToRgb(p, q, hue + (1 / 3));
            green = this.hueToRgb(p, q, hue);
            blue = this.hueToRgb(p, q, hue - (1 / 3));
        }

        red = red * 255;
        green = green * 255;
        blue = blue * 255;

        return new Rgba(red, green, blue, alpha);
    }

    private hueToRgb(p, q, t): number {
        // based on CamanJS
        if (t < 0) { t += 1; }
        if (t > 1) { t -= 1; }
        if (t < 1 / 6) { return p + (q - p) * 6 * t; }
        if (t < 1 / 2) { return q; }
        if (t < 2 / 3) { return p + (q - p) * (2 / 3 - t) * 6; }
        return p;
    }

    /**
     * The Red, Green, Blue values are given in the range of 0..255,
     *
     * the red color(R) is calculated from the cyan(C) and black(K) colors,
     * the green color(G) is calculated from the magenta(M) and black(K) colors,
     * The blue color(B) is calculated from the yellow(Y) and black(K) colors.
     *
     * Below is the formula of CMYK to RGB convertion
     *
     * Red = 255 × 1 - min( (1 - Cyan ÷ 100) × (1 - Black) )
     * Green = 255 × 1 - min(1 - Magenta ÷ 100) × (1 - Black)
     * Blue = 255 × 1 - min(1 - Yellow ÷ 100) × (1 - Black)
     */
    private cmykToRgba(color: Cmyk): Rgba {
        const black = color.black / 100;
        const cyan = color.cyan / 100;
        const magenta = color.magenta / 100;
        const yellow = color.yellow / 100;

        let red = Math.min(1, (1 - cyan) * (1 - black));
        let green = Math.min(1, (1 - magenta) * (1 - black));
        let blue = Math.min(1, (1 - yellow) * (1 - black));

        red = red * 255;
        green = green * 255;
        blue = blue * 255;

        return new Rgba(red, green, blue, 1);
    }

    /**
     * The max number of R, G, B values are 255, first of all, we divided them by 255 to become the number
     * of 0~1, this ratio will be used in the calculation.
     * Rc = R ÷ 255
     * Gc = G ÷ 255
     * Bc = B ÷ 255
     * The black key(K) color could be many result, when we assume a black key value,
     * the other three colors(cyan, magenta, yellow) can be calculated.
     * we can calculate it from the red, green and blue colors, the max number of black key should be :
     * K = 1 - min(Rc, Gc, Bc);
     *
     * or we can assume we run out of the black ink, need use the remaining other three color inks to finish the printing job.
     * K = 0;
     *
     * The cyan color(C) is calculated from the red and black colors:
     * C = (1 - Rc - K) ÷ (1 - K)
     *
     * The magenta color (M) is calculated from the green and black colors:
     * M = (1 - Gr - K) ÷ (1 - K)
     *
     * The yellow color(Y) is calculated from the blue and black colors:
     * Y = (1 - Bc - K) ÷ ( 1 - K)
     */
    private rgbaToCmyk(color: Rgba): Cmyk {
        const red = color.red / 255;
        const green = color.green / 255;
        const blue = color.blue / 255;

        let cyan = 1 - red;
        let magenta = 1 - green;
        let yellow = 1 - blue;
        let black = Math.min(cyan, magenta, yellow);

        if (black === 1) {
            return new Cmyk(0, 0, 0, 1);
        }

        cyan = (cyan - black) / (1 - black);
        magenta = (magenta - black) / (1 - black);
        yellow = (yellow - black) / (1 - black);

        black = black * 100;
        cyan = cyan * 100;
        magenta = magenta * 100;
        yellow = yellow * 100;

        return new Cmyk(cyan, magenta, yellow, black);
    }

    private roundNumber(n: number): number {
        return Math.round(n * 100) / 100;
    }

    private stringToColor(colorString: ColorString): this {
        const str = colorString.replace(/ /g, '').toLowerCase();
        /**
         * try to find color by name in table
         */
        let rgba: Rgba = ColorsTable[str] || null;

        /**
         * hex find
         */
        if (str[0] === '#') {
            let hex = str.substr(1);
            const length = hex.length;
            let a = 1;
            let hexArray = [];

            if (length === 3) {
                hexArray = hex.split('').map((value) => value + value);
            } else if (length === 6) {
                hexArray = hex.match(/.{2}/g);
            } else if (length === 8) {
                const alpha = hex.substr(-2);
                hex = hex.substr(0, length - 2);
                a = this.roundNumber(parseInt(alpha || 'FF', 16) / 255);
                hexArray = hex.match(/.{2}/g);
            }

            if (hexArray.length === 3) {
                rgba = new Rgba(parseInt(hexArray[0], 16), parseInt(hexArray[1], 16), parseInt(hexArray[2], 16), a);
            }
        }

        const OpenParenthesis = str.indexOf('(');
        const CloseParenthesis = str.indexOf(')');

        if (OpenParenthesis !== -1 && CloseParenthesis + 1 === str.length) {
            const colorTypeName = str.substr(0, OpenParenthesis);
            const params = str.substr(OpenParenthesis + 1, CloseParenthesis - (OpenParenthesis + 1)).split(',');
            let alpha = 1;

            switch (colorTypeName) {
                case 'rgba':
                    alpha = parseFloat(params.pop());
                // Fall through.
                case 'rgb':
                    rgba = new Rgba(parseInt(params[0], 10), parseInt(params[1], 10), parseInt(params[2], 10), alpha);
                    break;
                case 'hsla':
                    alpha = parseFloat(params.pop());
                case 'hsl':
                    const hsla = new Hsla(parseInt(params[0], 10), parseInt(params[1], 10), parseInt(params[2], 10), alpha);
                    rgba = this.hslaToRgba(hsla);
                    break;
                case 'cmyk':
                    const cmyk = new Cmyk(
                        parseInt(params[0], 10),
                        parseInt(params[1], 10),
                        parseInt(params[2], 10),
                        parseInt(params[3], 10));
                    rgba = this.cmykToRgba(cmyk);
                    break;
            }
        }

        if (rgba) {
            this.rgba = rgba;
            this.hsva = this.rgbaToHsva(rgba);
        }

        return this;
    }

}
