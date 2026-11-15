import { Cmyk } from './cmyk.class';
import { Hsla } from './hsla.class';
import { Hsva } from './hsva.class';
import { Rgba } from './rgba.class';
import { ColorsTable } from './colors-table.class';

export type ColorString = string;

const HEX_COLOR_REGEX = /^(?:[0-9a-f]{3,4}|[0-9a-f]{6}|[0-9a-f]{8})$/i;
const FUNCTIONAL_COLOR_REGEX = /^([a-z]+)\s*\(\s*([^()]*)\s*\)$/;
const WHITESPACE_REGEX = /\s+/;
const HAS_WHITESPACE_REGEX = /\s/;

export class Color {

    /**
     * base color used to calculate other
     * default color
     * rgb(255, 0, 0)
     * hsl(0, 100%, 50%)
     * #ff0000
     */
    private hsva: Hsva = new Hsva(0, 100, 100, 1);

    /**
     * Micro-optimization: caches the result of hsvaToRgba(this.hsva) to avoid
     * recalculating and allocating new Rgba instances on repeated getter/formatter calls.
     * Invalidated (reset to null) whenever this.hsva is modified.
     */
    private cachedRgba: Rgba | null = null;

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

        throw new Error('Invalid color type');
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
    public setHsva(hue: number, saturation: number = 100, brightness: number = 100, alpha: number = 1): this {
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

        this.cachedRgba = null;
        return this;
    }

    /**
     * define Color from RGBa
     */
    public setRgba(red: number, green: number, blue: number, alpha: number = 1): this {
        if (alpha != null) {
            alpha = alpha > 1 ? 1 : alpha < 0 ? 0 : alpha;
        }
        this.hsva = this.rgbaToHsva(new Rgba(red, green, blue, alpha));
        this.cachedRgba = null;
        return this;
    }

    /**
     * define Color from HSLa
     */
    public setHsla(hue: number, saturation: number, lightness: number, alpha: number = 1): this {
        if (alpha != null) {
            alpha = alpha > 1 ? 1 : alpha < 0 ? 0 : alpha;
        }

        const hsla = new Hsla(hue, saturation, lightness, alpha);
        this.hsva = this.hslaToHsva(hsla);
        this.cachedRgba = null;
        return this;
    }

    /**
     * return hexadecimal value formatted as '#341d2a' or '#341d2aFF' if alhpa channel is enabled
     */
    public toHexString(alpha: boolean = false): ColorString {
        const rgba = this.getCachedRgba();
        let hex = '#' + ((1 << 24) | (rgba.getRed() << 16) | (rgba.getGreen() << 8) | rgba.getBlue()).toString(16).substring(1);
        if (alpha) {
            hex += ((1 << 8) | Math.round(rgba.alpha * 255)).toString(16).substring(1);
        }
        return hex.toUpperCase();
    }

    /**
     * return rgba string formatted as rgba(52, 29, 42, 1)
     */
    public toRgbaString(): ColorString {
        return this.getCachedRgba().toString();
    }

    /**
     * return rgb string formatted as rgb(52, 29, 42)
     */
    public toRgbString(): ColorString {
        return this.getCachedRgba().toString(false);
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
        return this.getHsva().toString();
    }

    /**
     * return hsv string formatted as hsv(327, 29%, 16%)
     */
    public toHsvString(): ColorString {
        return this.getHsva().toString(false);
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
        const rgba = this.getCachedRgba();
        return new Rgba(rgba.red, rgba.green, rgba.blue, rgba.alpha);
    }

    public getHsla(): Hsla {
        return this.rgbaToHsla(this.getCachedRgba());
    }

    public getCmyk(): Cmyk {
        return this.rgbaToCmyk(this.getCachedRgba());
    }

    public equal(color: Color): boolean {
        return this.hsva.equal(color.getHsva());
    }

    private getCachedRgba(): Rgba {
        if (!this.cachedRgba) {
            this.cachedRgba = this.hsvaToRgba(this.hsva);
        }
        return this.cachedRgba;
    }

    private hsvaToHsla(color: Hsva): Hsla {
        const hue = color.hue;
        const s = color.saturation / 100;
        const v = color.value / 100;
        const lightness = ((2 - s) * v) / 2;
        const saturation = lightness === 0 || lightness === 1
            ? 0
            : (v - lightness) / Math.min(lightness, 1 - lightness);

        return new Hsla(hue, saturation * 100, lightness * 100, color.alpha);
    }

    private hslaToHsva(color: Hsla): Hsva {
        const hue = color.hue;
        const l = (color.lightness / 100) * 2;
        const s = (color.saturation / 100) * (l <= 1 ? l : 2 - l);
        const value = (l + s) / 2;
        const saturation = (2 * s) / (l + s) || 0;

        return new Hsva(hue, saturation * 100, value * 100, color.alpha);
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

    private hueToRgb(p: number, q: number, t: number): number {
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
            return new Cmyk(0, 0, 0, 100);
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
        const rgba = this.parseColorString(colorString);

        if (rgba) {
            this.hsva = this.rgbaToHsva(rgba);
            this.cachedRgba = null;
        }

        return this;
    }

    /**
     * parse color string (named color, hex, rgb(a), hsl(a) or cmyk) into Rgba
     * supports CSS Color 4 syntax:
     *  - comma and space separated channels, e.g. rgb(255, 0, 0), rgb(255 0 0), rgb(0 0 0 / 25%)
     *  - percentage channels, e.g. rgb(100%, 0%, 0%), rgba(255, 0, 0, 50%)
     *  - hue units (deg, rad, grad, turn), e.g. hsl(120deg 100% 50%)
     *  - 3, 4, 6 and 8 digit hex notation
     *
     * returns null if string is not a valid color
     */
    private parseColorString(colorString: ColorString): Rgba | null {
        if (typeof colorString !== 'string') {
            return null;
        }

        const str = colorString.trim().toLowerCase();

        /**
         * try to find color by name in table
         */
        if (Object.prototype.hasOwnProperty.call(ColorsTable, str)) {
            const named = ColorsTable[str as keyof typeof ColorsTable];
            if (named instanceof Rgba) {
                return new Rgba(named.red, named.green, named.blue, named.alpha);
            }
        }

        /**
         * hex find
         */
        if (str[0] === '#') {
            return this.parseHex(str.substring(1));
        }

        /**
         * functional notation find
         */
        const match = FUNCTIONAL_COLOR_REGEX.exec(str);
        if (!match) {
            return null;
        }

        const colorTypeName = match[1];
        const params = this.splitColorParams(match[2]);
        if (!params) {
            return null;
        }

        const { legacy } = params;
        let { channels, alpha: alphaParam } = params;

        // legacy (comma separated) syntax defines alpha as 4th channel, e.g. rgba(255, 0, 0, 0.5)
        if (legacy && colorTypeName !== 'cmyk' && channels.length === 4) {
            alphaParam = channels[3];
            channels = channels.slice(0, 3);
        }

        switch (colorTypeName) {
            case 'rgb':
            case 'rgba': {
                if (channels.length !== 3) {
                    return null;
                }
                const red = this.parseRgbChannel(channels[0]);
                const green = this.parseRgbChannel(channels[1]);
                const blue = this.parseRgbChannel(channels[2]);
                const alpha = this.parseAlphaChannel(alphaParam);
                if (!this.allFinite(red, green, blue, alpha)) {
                    return null;
                }
                return new Rgba(red, green, blue, alpha);
            }
            case 'hsl':
            case 'hsla': {
                if (channels.length !== 3) {
                    return null;
                }
                const hue = this.parseHueChannel(channels[0]);
                const saturation = this.parsePercentChannel(channels[1]);
                const lightness = this.parsePercentChannel(channels[2]);
                const alpha = this.parseAlphaChannel(alphaParam);
                if (!this.allFinite(hue, saturation, lightness, alpha)) {
                    return null;
                }
                return this.hslaToRgba(new Hsla(hue, saturation, lightness, alpha));
            }
            case 'cmyk': {
                if (alphaParam !== undefined || channels.length !== 4) {
                    return null;
                }
                const [cyan, magenta, yellow, black] = channels.map((channel) => this.parsePercentChannel(channel));
                if (!this.allFinite(cyan, magenta, yellow, black)) {
                    return null;
                }
                return this.cmykToRgba(new Cmyk(cyan, magenta, yellow, black));
            }
        }

        return null;
    }

    /**
     * parse #RGB, #RGBA, #RRGGBB and #RRGGBBAA hex notation (without leading #)
     */
    private parseHex(hex: string): Rgba | null {
        if (!HEX_COLOR_REGEX.test(hex)) {
            return null;
        }

        if (hex.length <= 4) {
            hex = hex.split('').map((value) => value + value).join('');
        }

        const red = parseInt(hex.substring(0, 2), 16);
        const green = parseInt(hex.substring(2, 4), 16);
        const blue = parseInt(hex.substring(4, 6), 16);
        const alpha = hex.length === 8 ? parseInt(hex.substring(6, 8), 16) / 255 : 1;

        return new Rgba(red, green, blue, alpha);
    }

    /**
     * split functional notation arguments into color channels and optional alpha channel
     *
     * legacy syntax: rgba(255, 0, 0, 0.5)
     * modern syntax: rgb(255 0 0 / 0.5)
     */
    private splitColorParams(params: string): { channels: string[], alpha?: string, legacy: boolean } | null {
        const value = params.trim();
        if (value === '') {
            return null;
        }

        if (value.indexOf(',') !== -1) {
            if (value.indexOf('/') !== -1) {
                return null;
            }
            const channels = value.split(',').map((part) => part.trim());
            if (channels.some((part) => part === '' || HAS_WHITESPACE_REGEX.test(part))) {
                return null;
            }
            return { channels, legacy: true };
        }

        const slashParts = value.split('/');
        if (slashParts.length > 2) {
            return null;
        }

        const channels = slashParts[0].trim().split(WHITESPACE_REGEX).filter((part) => part !== '');
        if (slashParts.length === 2) {
            const alpha = slashParts[1].trim();
            if (alpha === '' || HAS_WHITESPACE_REGEX.test(alpha)) {
                return null;
            }
            return { channels, alpha, legacy: false };
        }

        return { channels, legacy: false };
    }

    /**
     * parse number with optional unit, returns NaN for invalid values
     */
    private parseNumberWithUnit(value: string, units: string[]): { value: number, unit: string } {
        if (value === 'none') {
            return { value: 0, unit: '' };
        }
        if (!value) {
            return { value: NaN, unit: '' };
        }

        let unit = '';
        let numStr = value;

        if (value.endsWith('%')) {
            unit = '%';
            numStr = value.slice(0, -1);
        } else if (value.endsWith('grad')) {
            unit = 'grad';
            numStr = value.slice(0, -4);
        } else if (value.endsWith('turn')) {
            unit = 'turn';
            numStr = value.slice(0, -4);
        } else if (value.endsWith('deg')) {
            unit = 'deg';
            numStr = value.slice(0, -3);
        } else if (value.endsWith('rad')) {
            unit = 'rad';
            numStr = value.slice(0, -3);
        }

        if (unit !== '' && units.indexOf(unit) === -1) {
            return { value: NaN, unit: '' };
        }

        if (!this.isDecimalNumber(numStr)) {
            return { value: NaN, unit: '' };
        }

        return { value: Number(numStr), unit };
    }

    /**
     * check if string is a plain decimal number: [+-] digits [. digits] [e [+-] digits]
     * (rejects hex, binary and octal literals, Infinity, numeric separators, whitespace...)
     */
    private isDecimalNumber(value: string): boolean {
        const length = value.length;
        let i = 0;
        let code = value.charCodeAt(0);

        // sign
        if (code === 43 /* + */ || code === 45 /* - */) {
            i++;
        }

        let digits = 0;
        while (i < length && (code = value.charCodeAt(i)) >= 48 && code <= 57) {
            i++;
            digits++;
        }

        if (i < length && value.charCodeAt(i) === 46 /* . */) {
            i++;
            while (i < length && (code = value.charCodeAt(i)) >= 48 && code <= 57) {
                i++;
                digits++;
            }
        }

        if (digits === 0) {
            return false;
        }

        // exponent
        if (i < length && ((code = value.charCodeAt(i)) === 101 /* e */ || code === 69 /* E */)) {
            i++;
            if (i < length && ((code = value.charCodeAt(i)) === 43 || code === 45)) {
                i++;
            }
            let exponentDigits = 0;
            while (i < length && (code = value.charCodeAt(i)) >= 48 && code <= 57) {
                i++;
                exponentDigits++;
            }
            if (exponentDigits === 0) {
                return false;
            }
        }

        return i === length;
    }

    /**
     * red, green, blue channel: number (0 - 255) or percentage (0% - 100%)
     */
    private parseRgbChannel(channel: string): number {
        const { value, unit } = this.parseNumberWithUnit(channel, ['%']);
        const rgb = unit === '%' ? (value * 255) / 100 : value;
        return this.clamp(rgb, 0, 255);
    }

    /**
     * alpha channel: number (0 - 1) or percentage (0% - 100%)
     */
    private parseAlphaChannel(channel?: string): number {
        if (channel === undefined) {
            return 1;
        }
        const { value, unit } = this.parseNumberWithUnit(channel, ['%']);
        const alpha = unit === '%' ? value / 100 : value;
        return this.clamp(alpha, 0, 1);
    }

    /**
     * hue channel: number (degrees) or angle (deg, rad, grad, turn)
     * normalized to 0 - 360 range
     */
    private parseHueChannel(channel: string): number {
        const { value, unit } = this.parseNumberWithUnit(channel, ['deg', 'rad', 'grad', 'turn']);
        let degrees = value;

        switch (unit) {
            case 'rad': degrees = (value * 180) / Math.PI; break;
            case 'grad': degrees = (value * 360) / 400; break;
            case 'turn': degrees = value * 360; break;
        }

        return ((degrees % 360) + 360) % 360;
    }

    /**
     * percentage channel (saturation, lightness, cmyk): number or percentage, 0 - 100 range
     */
    private parsePercentChannel(channel: string): number {
        const { value } = this.parseNumberWithUnit(channel, ['%']);
        return this.clamp(value, 0, 100);
    }

    private clamp(value: number, min: number, max: number): number {
        return Math.min(max, Math.max(min, value));
    }

    private allFinite(...values: number[]): boolean {
        return values.every((value) => Number.isFinite(value));
    }

}