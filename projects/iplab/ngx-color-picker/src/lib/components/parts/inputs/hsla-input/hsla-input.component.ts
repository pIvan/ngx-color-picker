import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy, booleanAttribute } from '@angular/core';
import { Color } from './../../../../helpers/color.class';


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
    public color: Color;

    @Output()
    public colorChange = new EventEmitter<Color>(false);

    @Input({ alias: 'label', transform: booleanAttribute })
    public labelVisible: boolean = false;

    @Input({ alias: 'alpha', transform: booleanAttribute })
    public isAlphaVisible: boolean = true;

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
        this.colorChange.emit(newColor);
    }
}
