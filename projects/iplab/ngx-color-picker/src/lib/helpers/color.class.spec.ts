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
    red: {
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
    }));

    it('should correctly convert rgb', waitForAsync(() => {
        const blue = new Color(staticColors.blue.rgb);
        const green = new Color(staticColors.green.rgb);
        const lime = new Color(staticColors.lime.rgb);
        const yellow = new Color(staticColors.yellow.rgb);
        const red = new Color(staticColors.red.rgb);
        const purple = new Color(staticColors.purple.rgb);

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
    }));

    // it('should correctly convert hsl', async(() => {
    //     const blue = new Color(staticColors.blue.hsl);
    //     const green = new Color(staticColors.green.hsl);
    //     const lime = new Color(staticColors.lime.hsl);
    //     const yellow = new Color(staticColors.yellow.hsl);
    //     const red = new Color(staticColors.red.hsl);
    //     const purple = new Color(staticColors.purple.hsl);
    // }));

    // it('should correctly convert cmyk', async(() => {
    //     const blue = new Color(staticColors.blue.cmyk);
    //     const green = new Color(staticColors.green.cmyk);
    //     const lime = new Color(staticColors.lime.cmyk);
    //     const yellow = new Color(staticColors.yellow.cmyk);
    //     const red = new Color(staticColors.red.cmyk);
    //     const purple = new Color(staticColors.purple.cmyk);
    // }));

});