import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy } from "@angular/core";
import { Color } from "./../../../../helpers/color.class";


@Component({
    selector: `rgba-input-component`,
    templateUrl: `./rgba-input.component.html`,
    styleUrls: [
        `./../../base.style.scss`,
        `./../input.component.scss`,
        `./rgba-input.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class RgbaComponent {

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
        return this.color ? this.color.getRgba() : null;
    }

    public onInputChange(newValue: number, color: 'R' | 'G' | 'B' | 'A') {
        const value = this.value;
        const red = color === 'R' ? newValue : value.red;
        const green = color === 'G' ? newValue : value.green;
        const blue = color === 'B' ? newValue : value.blue;
        const alpha = color === 'A' ? newValue : value.alpha;

        const newColor = new Color().setRgba(red, green, blue, alpha);
        const hue = new Color().setHsva(newColor.getHsva().hue);

        this.hueChange.emit(hue);
        this.colorChange.emit(newColor);
    }
}