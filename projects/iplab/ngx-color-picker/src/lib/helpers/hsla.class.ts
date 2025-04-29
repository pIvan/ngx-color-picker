import { BaseColor } from './base-color.class';

/**
 * HSL and HSI are the same
 * 
 * Hue = ranges from 0 to 360°
 * Saturation = ranges from 0 to 100%
 * Lightness or Intensity = ranges from 0 to 100%
 * Alpha = range from 0-1
 */
export class Hsla extends BaseColor {

    constructor(public hue: number, public saturation: number, public lightness: number, public alpha: number) {
        super();
    }

    public toString(showAlphaChannel: boolean = true): string {
        return showAlphaChannel
            ? `hsla(${this.getHue()}, ${this.getSaturation()}%, ${this.getLightness()}%, ${this.getAlpha(true)})`
            : `hsl(${this.getHue()}, ${this.getSaturation()}%, ${this.getLightness()}%)`;
    }

    public getHue() {
        return Math.round(this.hue);
    }

    public getSaturation() {
        return Math.round(this.saturation);
    }

    public getLightness() {
        return Math.round(this.lightness);
    }

    public getAlpha(round: boolean = false): number {
        if (round != false) {
            return this.round(this.getAlpha());
        }
        return this.alpha;
    }

    public equal(color: Hsla): boolean {
        if (this === color) {
            return true;
        }
        return this.hue === color.hue
            && this.saturation === color.saturation
            && this.lightness === color.lightness
            && this.alpha === color.alpha;
    }
}
