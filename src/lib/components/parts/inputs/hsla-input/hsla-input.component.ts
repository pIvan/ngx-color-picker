import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy } from "@angular/core";
import { Color } from "./../../../../helpers/color.class";


@Component({
    selector: `hsla-input-component`,
    templateUrl: `./hsla-input.component.html`,
    styleUrls: [
        `./../../base.style.scss`,
        `./../input.component.scss`,
        `./hsla-input.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HslaComponent {

    @Input()
    public hue: Color;

    @Output()
    public hueChange = new EventEmitter<Color>(false);

    @Input()
    public color: Color;

    @Output()
    public colorChange = new EventEmitter<Color>(false);

    public labelVisible: boolean;

    @Input()
    public set label(value) {
        this.labelVisible = true;
    }

    public isAlphaVisible: boolean = true;

    @Input()
    public set alpha(isVisible: boolean) {
        this.isAlphaVisible = isVisible;
    }

    public get value() {
        return this.color ? this.color.getHsla() : null;
    }

    public onInputChange(newValue: number, color: 'H' | 'S' | 'L' | 'A') {
        const value = this.value;
        const hue = color === 'H' ? newValue : value.hue;
        const saturation = color === 'S' ? newValue : value.saturation;
        const lightness = color === 'L' ? newValue : value.lightness;
        const alpha = color === 'A' ? newValue : value.alpha;


        const newColor = new Color().setHsla(hue, saturation, lightness, alpha);
        const hueColor = new Color().setHsva(newColor.getHsva().hue);

        this.hueChange.emit(hueColor);
        this.colorChange.emit(newColor);
    }
}