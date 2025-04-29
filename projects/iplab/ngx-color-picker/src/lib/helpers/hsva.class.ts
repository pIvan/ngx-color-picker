import { BaseColor } from './base-color.class';

/**
 * HSB and HSV are the same
 *
 * Hue = ranges from 0 to 360°
 * Saturation = ranges from 0 to 100%
 * Brightness or Value = ranges from 0 to 100%
 * Alpha = range from 0-1
 */
export class Hsva extends BaseColor {

    constructor(public hue: number, public saturation: number, public value: number, public alpha: number) {
        super();
    }

    public toString(showAlphaChannel: boolean = true): string {
        return showAlphaChannel ? `hsva(${this.getHue()}, ${this.getSaturation()}%, ${this.getValue()}%, ${this.getAlpha(true)})`
            : `hsv(${this.getHue()}, ${this.getSaturation()}%, ${this.getValue()}%)`;
    }

    public getHue() {
        return Math.round(this.hue);
    }

    public getSaturation() {
        return Math.round(this.saturation);
    }

    public getValue() {
        return Math.round(this.value);
    }

    public getAlpha(round: boolean = false): number {
        if (round != false) {
            return this.round(this.getAlpha());
        }
        return this.alpha;
    }

    public equal(color: Hsva): boolean {
        if (this === color) {
            return true;
        }
        return this.hue === color.hue
            && this.saturation === color.saturation
            && this.value === color.value
            && this.alpha === color.alpha;
    }
}
