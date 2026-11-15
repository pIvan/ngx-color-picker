import { TestBed, inject, fakeAsync, tick, waitForAsync } from '@angular/core/testing';
import { Color } from '@iplab/ngx-color-picker';

const staticColors = {
    blue: {
        hex: '#4286f4',
        rgb: 'rgb(66, 134, 244)',
        hsv: 'hsv(217, 73%, 96%)',
        hsl: 'hsl(217, 89%, 61%)',
        cmyk: 'cmyk(73%, 45%, 0%, 4%)'
    },
    green: {
        hex: '#3bd626',
        rgb: 'rgb(59, 214, 38)',
        hsv: 'hsv(113, 82%, 84%)',
        hsl: 'hsl(113, 70%, 49%)',
        cmyk: 'cmyk(72%, 0%, 82%, 16%)'
    },
    lime: {
        hex: '#46e529',
        rgb: 'rgb(70, 229, 41)',
        hsv: 'hsv(111, 82%, 90%)',
        hsl: 'hsl(111, 78%, 53%)',
        cmyk: 'cmyk(69%, 0%, 82%, 10%)'
    },
    yellow: {
        hex: '#d2dbaf',
        rgb: 'rgb(210, 219, 175)',
        hsv: 'hsv(72, 20%, 86%)',
        hsl: 'hsl(72, 38%, 77%)',
        cmyk: 'cmyk(4%, 0%, 20%, 14%)'
    },
    orange: {
        hex: '#e84833',
        rgb: 'rgb(232, 72, 51)',
        hsv: 'hsv(7, 78%, 91%)',
        hsl: 'hsl(7, 80%, 55%)',
        cmyk: 'cmyk(0%, 69%, 78%, 9%)'
    },
    purple: {
        hex: '#63141f',
        rgb: 'rgb(99, 20, 31)',
        hsv: 'hsv(352, 80%, 39%)',
        hsl: 'hsl(352, 66%, 23%)',
        cmyk: 'cmyk(0%, 80%, 69%, 61%)'
    },
    red: {
        hex: '#ff0000',
        rgb: 'rgb(255, 0, 0)',
        hsv: 'hsv(0, 100%, 100%)',
        hsl: 'hsl(0, 100%, 50%)',
        cmyk: 'cmyk(0%, 100%, 100%, 0%)'
    },
    black: {
        hex: '#000000',
        rgb: 'rgb(0, 0, 0)',
        hsv: 'hsv(0, 0%, 0%)',
        hsl: 'hsl(0, 0%, 0%)',
        cmyk: 'cmyk(0%, 0%, 0%, 100%)'
    }
}

describe('Color.class', () => {

    it('should correctly convert hex', waitForAsync(() => {
        const blue = new Color(staticColors.blue.hex);
        const green = new Color(staticColors.green.hex);
        const lime = new Color(staticColors.lime.hex);
        const yellow = new Color(staticColors.yellow.hex);
        const red = new Color(staticColors.red.hex);
        const purple = new Color(staticColors.purple.hex);
        const orange = new Color(staticColors.orange.hex);
        const black = new Color(staticColors.black.hex);

        expect(blue.toHexString()).toBe(staticColors.blue.hex.toUpperCase());
        expect(blue.toHslString()).toBe(staticColors.blue.hsl);
        expect(blue.toRgbString()).toBe(staticColors.blue.rgb);
        expect(blue.toHsvString()).toBe(staticColors.blue.hsv);
        expect(blue.toCmykString()).toBe(staticColors.blue.cmyk);

        expect(green.toHexString()).toBe(staticColors.green.hex.toUpperCase());
        expect(green.toHslString()).toBe(staticColors.green.hsl);
        expect(green.toRgbString()).toBe(staticColors.green.rgb);
        expect(green.toHsvString()).toBe(staticColors.green.hsv);
        expect(green.toCmykString()).toBe(staticColors.green.cmyk);

        expect(lime.toHexString()).toBe(staticColors.lime.hex.toUpperCase());
        expect(lime.toHslString()).toBe(staticColors.lime.hsl);
        expect(lime.toRgbString()).toBe(staticColors.lime.rgb);
        expect(lime.toHsvString()).toBe(staticColors.lime.hsv);
        expect(lime.toCmykString()).toBe(staticColors.lime.cmyk);

        expect(yellow.toHexString()).toBe(staticColors.yellow.hex.toUpperCase());
        expect(yellow.toHslString()).toBe(staticColors.yellow.hsl);
        expect(yellow.toRgbString()).toBe(staticColors.yellow.rgb);
        expect(yellow.toHsvString()).toBe(staticColors.yellow.hsv);
        expect(yellow.toCmykString()).toBe(staticColors.yellow.cmyk);

        expect(red.toHexString()).toBe(staticColors.red.hex.toUpperCase());
        expect(red.toHslString()).toBe(staticColors.red.hsl);
        expect(red.toRgbString()).toBe(staticColors.red.rgb);
        expect(red.toHsvString()).toBe(staticColors.red.hsv);
        expect(red.toCmykString()).toBe(staticColors.red.cmyk);

        expect(purple.toHexString()).toBe(staticColors.purple.hex.toUpperCase());
        expect(purple.toHslString()).toBe(staticColors.purple.hsl);
        expect(purple.toRgbString()).toBe(staticColors.purple.rgb);
        expect(purple.toHsvString()).toBe(staticColors.purple.hsv);
        expect(purple.toCmykString()).toBe(staticColors.purple.cmyk);

        expect(orange.toHexString()).toBe(staticColors.orange.hex.toUpperCase());
        expect(orange.toHslString()).toBe(staticColors.orange.hsl);
        expect(orange.toRgbString()).toBe(staticColors.orange.rgb);
        expect(orange.toHsvString()).toBe(staticColors.orange.hsv);
        expect(orange.toCmykString()).toBe(staticColors.orange.cmyk);

        expect(black.toHexString()).toBe(staticColors.black.hex.toUpperCase());
        expect(black.toHslString()).toBe(staticColors.black.hsl);
        expect(black.toRgbString()).toBe(staticColors.black.rgb);
        expect(black.toHsvString()).toBe(staticColors.black.hsv);
        expect(black.toCmykString()).toBe(staticColors.black.cmyk);
    }));

    it('should convert color with alpha correctly', () => {
        const RGBA = "rgba(0, 0, 0, 0.694)";
        const HEX = "#000000B1";
        const HSLA = "hsla(0, 0%, 0%, 0.694)";

        const RGBA_ROUND = "rgba(0, 0, 0, 0.69)";
        const HSLA_ROUND = "hsla(0, 0%, 0%, 0.69)";

        const FROM_HEX = new Color(HEX);
        const FROM_RGBA = new Color(RGBA);
        const FROM_HSLA = new Color(HSLA);

        expect(FROM_HEX.toHexString(true)).toBe(HEX);
        expect(FROM_HEX.toRgbaString()).toBe(RGBA_ROUND);
        expect(FROM_HEX.toHslaString()).toBe(HSLA_ROUND);

        expect(FROM_RGBA.toHexString(true)).toBe(HEX);
        expect(FROM_RGBA.toRgbaString()).toBe(RGBA_ROUND);
        expect(FROM_RGBA.toHslaString()).toBe(HSLA_ROUND);

        expect(FROM_HSLA.toHexString(true)).toBe(HEX);
        expect(FROM_HSLA.toRgbaString()).toBe(RGBA_ROUND);
        expect(FROM_HSLA.toHslaString()).toBe(HSLA_ROUND);
    });

    it('should correctly convert rgb', waitForAsync(() => {
        const blue = new Color(staticColors.blue.rgb);
        const green = new Color(staticColors.green.rgb);
        const lime = new Color(staticColors.lime.rgb);
        const yellow = new Color(staticColors.yellow.rgb);
        const red = new Color(staticColors.red.rgb);
        const purple = new Color(staticColors.purple.rgb);
        const orange = new Color(staticColors.orange.rgb);
        const black = new Color(staticColors.black.rgb);

        expect(blue.toHexString()).toBe(staticColors.blue.hex.toUpperCase());
        expect(blue.toHslString()).toBe(staticColors.blue.hsl);
        expect(blue.toRgbString()).toBe(staticColors.blue.rgb);
        expect(blue.toHsvString()).toBe(staticColors.blue.hsv);
        expect(blue.toCmykString()).toBe(staticColors.blue.cmyk);

        expect(green.toHexString()).toBe(staticColors.green.hex.toUpperCase());
        expect(green.toHslString()).toBe(staticColors.green.hsl);
        expect(green.toRgbString()).toBe(staticColors.green.rgb);
        expect(green.toHsvString()).toBe(staticColors.green.hsv);
        expect(green.toCmykString()).toBe(staticColors.green.cmyk);

        expect(lime.toHexString()).toBe(staticColors.lime.hex.toUpperCase());
        expect(lime.toHslString()).toBe(staticColors.lime.hsl);
        expect(lime.toRgbString()).toBe(staticColors.lime.rgb);
        expect(lime.toHsvString()).toBe(staticColors.lime.hsv);
        expect(lime.toCmykString()).toBe(staticColors.lime.cmyk);

        expect(yellow.toHexString()).toBe(staticColors.yellow.hex.toUpperCase());
        expect(yellow.toHslString()).toBe(staticColors.yellow.hsl);
        expect(yellow.toRgbString()).toBe(staticColors.yellow.rgb);
        expect(yellow.toHsvString()).toBe(staticColors.yellow.hsv);
        expect(yellow.toCmykString()).toBe(staticColors.yellow.cmyk);

        expect(red.toHexString()).toBe(staticColors.red.hex.toUpperCase());
        expect(red.toHslString()).toBe(staticColors.red.hsl);
        expect(red.toRgbString()).toBe(staticColors.red.rgb);
        expect(red.toHsvString()).toBe(staticColors.red.hsv);
        expect(red.toCmykString()).toBe(staticColors.red.cmyk);

        expect(purple.toHexString()).toBe(staticColors.purple.hex.toUpperCase());
        expect(purple.toHslString()).toBe(staticColors.purple.hsl);
        expect(purple.toRgbString()).toBe(staticColors.purple.rgb);
        expect(purple.toHsvString()).toBe(staticColors.purple.hsv);
        expect(purple.toCmykString()).toBe(staticColors.purple.cmyk);

        expect(orange.toHexString()).toBe(staticColors.orange.hex.toUpperCase());
        expect(orange.toHslString()).toBe(staticColors.orange.hsl);
        expect(orange.toRgbString()).toBe(staticColors.orange.rgb);
        expect(orange.toHsvString()).toBe(staticColors.orange.hsv);
        expect(orange.toCmykString()).toBe(staticColors.orange.cmyk);

        expect(black.toHexString()).toBe(staticColors.black.hex.toUpperCase());
        expect(black.toHslString()).toBe(staticColors.black.hsl);
        expect(black.toRgbString()).toBe(staticColors.black.rgb);
        expect(black.toHsvString()).toBe(staticColors.black.hsv);
        expect(black.toCmykString()).toBe(staticColors.black.cmyk);
    }));

    // https://github.com/pIvan/ngx-color-picker/issues/118
    it('should default to red color', () => {
        expect(new Color().toHexString()).toBe('#FF0000');
        expect(new Color().toRgbaString()).toBe('rgba(255, 0, 0, 1)');
    });

    it('should parse percentage channels', () => {
        expect(new Color('rgb(100%, 0%, 0%)').toRgbString()).toBe('rgb(255, 0, 0)');
        expect(new Color('rgb(100%, 50%, 0%)').toRgbString()).toBe('rgb(255, 128, 0)');
        expect(new Color('rgb(100%, 50%, 0%, 0.25)').toRgbaString()).toBe('rgba(255, 128, 0, 0.25)');
        expect(new Color('rgba(255, 0, 0, 50%)').toRgbaString()).toBe('rgba(255, 0, 0, 0.5)');
        expect(new Color('rgba(255, 0, 0, 50%)').toHexString(true)).toBe('#FF000080');
        expect(new Color('rgba(100%, 0%, 50%, 50%)').toRgbaString()).toBe('rgba(255, 0, 128, 0.5)');
        expect(new Color('hsla(0, 100%, 50%, 25%)').toRgbaString()).toBe('rgba(255, 0, 0, 0.25)');
        expect(new Color('hsl(120, 100%, 50%, 50%)').toRgbaString()).toBe('rgba(0, 255, 0, 0.5)');
    });

    it('should parse legacy comma-separated rgb/rgba and hsl/hsla variants', () => {
        expect(new Color('rgb(255,0,0)').toRgbString()).toBe('rgb(255, 0, 0)');
        expect(new Color('rgb(255, 0, 0, 0.5)').toRgbaString()).toBe('rgba(255, 0, 0, 0.5)');
        expect(new Color('rgba(0, 255, 0)').toRgbaString()).toBe('rgba(0, 255, 0, 1)');
        expect(new Color('rgba(255,0,0,0)').toRgbaString()).toBe('rgba(255, 0, 0, 0)');
        expect(new Color('hsl(120,100%,50%)').toRgbString()).toBe('rgb(0, 255, 0)');
        expect(new Color('hsl(240, 100%, 50%, 0.5)').toRgbaString()).toBe('rgba(0, 0, 255, 0.5)');
        expect(new Color('hsla(120, 100%, 50%)').toRgbaString()).toBe('rgba(0, 255, 0, 1)');
        expect(new Color('  rgb(  255 ,  128 ,  0  )  ').toRgbString()).toBe('rgb(255, 128, 0)');
    });

    it('should parse space separated (CSS Color 4) syntax', () => {
        expect(new Color('rgb(255 0 0)').toRgbString()).toBe('rgb(255, 0, 0)');
        expect(new Color('rgba(255 0 0)').toRgbaString()).toBe('rgba(255, 0, 0, 1)');
        expect(new Color('rgb(0 0 0 / 25%)').toRgbaString()).toBe('rgba(0, 0, 0, 0.25)');
        expect(new Color('rgba(0 0 255 / 0.5)').toRgbaString()).toBe('rgba(0, 0, 255, 0.5)');
        expect(new Color('rgb(100% 50% 0% / 50%)').toRgbaString()).toBe('rgba(255, 128, 0, 0.5)');
        expect(new Color('rgb(100% 128 0)').toRgbString()).toBe('rgb(255, 128, 0)');
        expect(new Color('rgb(255 0 0/0.5)').toRgbaString()).toBe('rgba(255, 0, 0, 0.5)');
        expect(new Color('rgb(255\t128\n0\t/\t50%)').toRgbaString()).toBe('rgba(255, 128, 0, 0.5)');
        expect(new Color('hsl(120deg 100% 50%)').toRgbString()).toBe('rgb(0, 255, 0)');
        expect(new Color('hsla(120 100% 50%)').toRgbaString()).toBe('rgba(0, 255, 0, 1)');
        expect(new Color('hsl(240 100% 50% / 0.5)').toRgbaString()).toBe('rgba(0, 0, 255, 0.5)');
        expect(new Color('hsla(120deg 100% 50% / 50%)').toRgbaString()).toBe('rgba(0, 255, 0, 0.5)');
        expect(new Color('hsl(120 100% 50%/25%)').toRgbaString()).toBe('rgba(0, 255, 0, 0.25)');
        expect(new Color('hsl(120 100 50)').toRgbString()).toBe('rgb(0, 255, 0)');
        expect(new Color('  RGB( 255 , 0 , 0 )  ').toRgbString()).toBe('rgb(255, 0, 0)');
        expect(new Color('RgBa(255 0 0 / 50%)').toRgbaString()).toBe('rgba(255, 0, 0, 0.5)');
        expect(new Color('HSL(120DEG 100% 50%)').toRgbString()).toBe('rgb(0, 255, 0)');
        expect(new Color('HsLa(0.5TURN 100% 50% / 50%)').toRgbaString()).toBe('rgba(0, 255, 255, 0.5)');
    });

    it('should parse none keyword (CSS Color 4)', () => {
        expect(new Color('rgb(none 255 0)').toRgbString()).toBe('rgb(0, 255, 0)');
        expect(new Color('rgb(255 none 128 / none)').toRgbaString()).toBe('rgba(255, 0, 128, 0)');
        expect(new Color('rgb(255 none 128 / none)').toHexString(true)).toBe('#FF008000');
        expect(new Color('hsl(none 100% 50%)').toRgbString()).toBe('rgb(255, 0, 0)');
        expect(new Color('hsl(120 none 50%)').toRgbString()).toBe('rgb(128, 128, 128)');
        expect(new Color('hsl(120 100% none / none)').toRgbaString()).toBe('rgba(0, 0, 0, 0)');
        expect(new Color('RGB(NONE 0 255 / NONE)').toRgbaString()).toBe('rgba(0, 0, 255, 0)');
    });

    it('should parse hue units and wrapping', () => {
        expect(new Color('hsl(0deg, 100%, 50%)').toRgbString()).toBe('rgb(255, 0, 0)');
        expect(new Color('hsl(360deg, 100%, 50%)').toRgbString()).toBe('rgb(255, 0, 0)');
        expect(new Color('hsl(-90deg, 100%, 50%)').toRgbString()).toBe('rgb(128, 0, 255)');
        expect(new Color('hsl(540deg, 100%, 50%)').toRgbString()).toBe('rgb(0, 255, 255)');
        expect(new Color('hsl(0.5turn, 100%, 50%)').toRgbString()).toBe('rgb(0, 255, 255)');
        expect(new Color('hsl(-0.25turn, 100%, 50%)').toRgbString()).toBe('rgb(128, 0, 255)');
        expect(new Color('hsl(1.5turn, 100%, 50%)').toRgbString()).toBe('rgb(0, 255, 255)');
        expect(new Color('hsl(100grad, 100%, 50%)').toRgbString()).toBe('rgb(128, 255, 0)');
        expect(new Color('hsl(200grad, 100%, 50%)').toRgbString()).toBe('rgb(0, 255, 255)');
        expect(new Color('hsl(-100grad, 100%, 50%)').toRgbString()).toBe('rgb(128, 0, 255)');
        expect(new Color(`hsl(${Math.PI}rad, 100%, 50%)`).toRgbString()).toBe('rgb(0, 255, 255)');
        expect(new Color(`hsl(${-Math.PI / 2}rad, 100%, 50%)`).toRgbString()).toBe('rgb(128, 0, 255)');
        expect(new Color(`hsl(${2 * Math.PI}rad, 100%, 50%)`).toRgbString()).toBe('rgb(255, 0, 0)');
        expect(new Color('hsl(480, 100%, 50%)').toRgbString()).toBe('rgb(0, 255, 0)');
        expect(new Color('hsl(-120, 100%, 50%)').toRgbString()).toBe('rgb(0, 0, 255)');
    });

    it('should parse 3, 4, 6 and 8 digit hex notation', () => {
        expect(new Color('#0f0').toHexString(true)).toBe('#00FF00FF');
        expect(new Color('#abc').toHexString(true)).toBe('#AABBCCFF');
        expect(new Color('#f008').toHexString(true)).toBe('#FF000088');
        expect(new Color('#1234').toHexString(true)).toBe('#11223344');
        expect(new Color('#0000').toRgbaString()).toBe('rgba(0, 0, 0, 0)');
        expect(new Color('#ffff').toHexString(true)).toBe('#FFFFFFFF');
        expect(new Color('#AbCdEf').toHexString(true)).toBe('#ABCDEFFF');
        expect(new Color('  #aBcDeF80  ').toHexString(true)).toBe('#ABCDEF80');
        expect(new Color('#ff000000').toRgbaString()).toBe('rgba(255, 0, 0, 0)');
        expect(new Color('#00ff00ff').toRgbaString()).toBe('rgba(0, 255, 0, 1)');
    });

    it('should parse fractional, leading-dot and scientific notation numbers', () => {
        expect(new Color('rgb(127.5, 0, 0)').toHexString()).toBe('#800000');
        expect(new Color('rgb(+.5e3, 2.55E2, -0)').toRgbString()).toBe('rgb(255, 255, 0)');
        expect(new Color('rgb(1e2 1.5e2 2.5e2)').toRgbString()).toBe('rgb(100, 150, 250)');
        expect(new Color('rgba(255, 0, 0, .5)').toRgbaString()).toBe('rgba(255, 0, 0, 0.5)');
        expect(new Color('rgba(255, 0, 0, +.25)').toRgbaString()).toBe('rgba(255, 0, 0, 0.25)');
        expect(new Color('rgb(50.5% 0% 0% / 1e-1)').toRgbaString()).toBe('rgba(129, 0, 0, 0.1)');
        expect(new Color('hsl(.5turn 100% 50%)').toRgbString()).toBe('rgb(0, 255, 255)');
    });

    it('should clamp out of range channels and handle achromatic hsl', () => {
        expect(new Color('rgb(300, -20, 0)').toRgbString()).toBe('rgb(255, 0, 0)');
        expect(new Color('rgb(150%, -10%, 50%)').toRgbString()).toBe('rgb(255, 0, 128)');
        expect(new Color('rgba(255, 0, 0, 2)').toRgbaString()).toBe('rgba(255, 0, 0, 1)');
        expect(new Color('rgba(255, 0, 0, -0.5)').toRgbaString()).toBe('rgba(255, 0, 0, 0)');
        expect(new Color('rgb(255 0 0 / 150%)').toRgbaString()).toBe('rgba(255, 0, 0, 1)');
        expect(new Color('rgb(255 0 0 / -25%)').toRgbaString()).toBe('rgba(255, 0, 0, 0)');
        expect(new Color('hsl(0, 150%, 50%)').toRgbString()).toBe('rgb(255, 0, 0)');
        expect(new Color('hsl(0, -50%, 50%)').toRgbString()).toBe('rgb(128, 128, 128)');
        expect(new Color('hsl(0, 100%, 150%)').toRgbString()).toBe('rgb(255, 255, 255)');
        expect(new Color('hsl(0, 100%, -20%)').toRgbString()).toBe('rgb(0, 0, 0)');
        expect(new Color('hsl(120, 0%, 50%)').toRgbString()).toBe('rgb(128, 128, 128)');
        expect(new Color('hsl(0, 100%, 100%)').toRgbString()).toBe('rgb(255, 255, 255)');
        expect(new Color('hsl(240, 100%, 0%)').toRgbString()).toBe('rgb(0, 0, 0)');
    });

    it('should ignore invalid color strings', () => {
        const invalid = [
            '', '   ',
            // invalid named / unimplemented functions
            'name', 'notacolor', 'toString', 'constructor', 'valueOf', 'hasOwnProperty',
            'currentcolor', 'inherit', 'initial', 'unset',
            'hwb(0 0% 0%)', 'lab(50% 40 59.5)', 'lch(50% 40 59.5)', 'oklab(0.5 0.1 -0.1)', 'oklch(0.6 0.15 50)', 'color(srgb 1 0 0)', 'hsv(0, 100%, 100%)',
            // invalid hex
            '#', '#1', '#12', '#12345', '#1234567', '#123456789', '#ggg', '#123g', '#12345g', 'ff0000', '#ff 00 00',
            // invalid separators / mixing comma and space or slash
            'rgb(255, 0, 0 / 0.5)', 'rgba(255, 0, 0, / 0.5)', 'hsl(0, 100%, 50% / 0.5)',
            'rgb(255, 0 0)', 'rgb(255 0, 0)', 'rgb(, 255, 0, 0)', 'rgb(255, 0, 0,)', 'rgb(255,,0)',
            // wrong argument count
            'rgb()', 'rgb(255)', 'rgb(255, 0)', 'rgb(255, 0, 0, 0.5, 1)',
            'rgb(255 0)', 'rgb(255 0 0 0.5)', 'rgb(255 0 0 /)', 'rgb(/ 0.5)', 'rgb(255 0 0 / 0.5 1)', 'rgb(1 2 3 / 4 / 5)',
            'hsl()', 'hsl(0, 100%)', 'hsl(0 100%)', 'hsl(0 100% 50% 0.5)', 'hsl(0, 100%, 50%, 0.5, 1)', 'hsl(0 100% 50% /)',
            'cmyk(0%, 0%, 0%)', 'cmyk(0%, 0%, 0%, 0%, 0%)', 'cmyk(0% 0% 0% 0% / 0.5)',
            // wrong units
            'rgb(255px, 0, 0)', 'rgb(255deg, 0, 0)', 'rgb(255 0 0 / 10deg)', 'rgb(255 0 0 / 10px)',
            'hsl(10px 100% 50%)', 'hsl(120%, 100%, 50%)', 'hsl(120, 100deg, 50%)', 'hsl(120, 100%, 50rad)', 'hsl(120, 100%, 50%, 0.5turn)',
            'cmyk(0deg, 0%, 0%, 0%)',
            // invalid numbers
            'rgb(a, b, c)', 'rgb(0b11111111, 0, 0)', 'rgb(0o377, 0, 0)', 'rgb(0xff, 0, 0)',
            'rgb(infinity, 0, 0)', 'rgb(-infinity, 0, 0)', 'rgb(NaN, 0, 0)', 'rgb(1_0, 0, 0)',
            'rgb(1e, 0, 0)', 'rgb(1e+, 0, 0)', 'rgb(1e-, 0, 0)', 'rgb(1e1.5, 0, 0)',
            'rgb(., 0, 0)', 'rgb(-., 0, 0)', 'rgb(+., 0, 0)', 'rgb(+, 0, 0)', 'rgb(--1, 0, 0)', 'rgb(++1, 0, 0)',
            'rgb(1.2.3, 0, 0)', 'rgb(1..2, 0, 0)', 'rgb(%, 0, 0)', 'hsl(deg, 100%, 50%)', 'hsl(turn 100% 50%)',
            // malformed parentheses / surrounding text
            'rgb(255, 0, 0', 'rgb255, 0, 0)', 'rgb((255, 0, 0))', 'rgb(255, 0, 0) extra', 'prefix rgb(255, 0, 0)'
        ];
        invalid.forEach((value) => {
            const color = new Color('#00ff00').setFromString(value);
            expect(color.toHexString(true)).withContext(value).toBe('#00FF00FF');
        });

        expect(new Color('#00ff00').setFromString(null as any).toHexString(true)).toBe('#00FF00FF');
        expect(new Color('#00ff00').setFromString(undefined as any).toHexString(true)).toBe('#00FF00FF');
    });

    it('should parse named colors', () => {
        expect(new Color('Red').toHexString()).toBe('#FF0000');
        expect(new Color('  CornflowerBlue  ').toRgbString()).toBe('rgb(100, 149, 237)');
        expect(new Color('TRANSPARENT').toRgbaString()).toBe('rgba(0, 0, 0, 0)');
        expect(new Color('aqua').toHexString()).toBe(new Color('cyan').toHexString());
        expect(new Color('fuchsia').toHexString()).toBe(new Color('magenta').toHexString());
        expect(new Color('gray').toHexString()).toBe(new Color('grey').toHexString());
        expect(new Color('darkgray').toHexString()).toBe(new Color('darkgrey').toHexString());
        expect(new Color('darkslategray').toHexString()).toBe(new Color('darkslategrey').toHexString());
        expect(new Color('dimgray').toHexString()).toBe(new Color('dimgrey').toHexString());
        expect(new Color('lightgray').toHexString()).toBe(new Color('lightgrey').toHexString());
        expect(new Color('lightslategray').toHexString()).toBe(new Color('lightslategrey').toHexString());
        expect(new Color('slategray').toHexString()).toBe(new Color('slategrey').toHexString());
    });

    it('should set color from HSLa values', () => {
        expect(new Color().setHsla(120, 100, 50).toRgbString()).toBe('rgb(0, 255, 0)');
        expect(new Color().setHsla(217, 89, 61).toHslString()).toBe('hsl(217, 89%, 61%)');
        expect(Color.from(new Color('hsl(7, 80%, 55%)').getHsla()).toHslString()).toBe('hsl(7, 80%, 55%)');
    });

    it('should correctly convert hsvaToHsla', () => {
        const color = new Color(staticColors.blue.hex);
        const hsla = (color as any).hsvaToHsla(color.getHsva());
        expect(hsla.toString(false)).toBe(staticColors.blue.hsl);

        const black = new Color('#000000');
        expect((black as any).hsvaToHsla(black.getHsva()).toString(false)).toBe('hsl(0, 0%, 0%)');

        const white = new Color('#ffffff');
        expect((white as any).hsvaToHsla(white.getHsva()).toString(false)).toBe('hsl(0, 0%, 100%)');
    });

    // it('should correctly convert cmyk', async(() => {
    //     const blue = new Color(staticColors.blue.cmyk);
    //     const green = new Color(staticColors.green.cmyk);
    //     const lime = new Color(staticColors.lime.cmyk);
    //     const yellow = new Color(staticColors.yellow.cmyk);
    //     const red = new Color(staticColors.red.cmyk);
    //     const purple = new Color(staticColors.purple.cmyk);
    // }));

});