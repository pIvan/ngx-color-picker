import { Component, ChangeDetectionStrategy, booleanAttribute, InputSignal, input, model, ModelSignal } from '@angular/core';
import { Color } from './../../../../helpers/color.class';
import { ColorPickerInputDirective } from '../../../../directives/color-picker-input.directive';


@Component({
    selector: `hsla-input-component`,
    templateUrl: `./hsla-input.component.html`,
    styleUrls: [
        `./../../base.style.scss`,
        `./../input.component.scss`,
        `./hsla-input.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ColorPickerInputDirective]
})
export class HslaComponent {

    public color: ModelSignal<Color> = model.required<Color>();

    public labelVisible: InputSignal<boolean> = input<boolean, boolean>(false, { alias: 'label', transform: booleanAttribute });

    public isAlphaVisible: InputSignal<boolean> = input<boolean, boolean>(true, { alias: 'alpha', transform: booleanAttribute });

    public get value() {
        return this.color()?.getHsla();
    }

    public onInputChange(newValue: number, color: 'H' | 'S' | 'L' | 'A') {
        const value = this.value;
        const hue = color === 'H' ? newValue : value.hue;
        const saturation = color === 'S' ? newValue : value.saturation;
        const lightness = color === 'L' ? newValue : value.lightness;
        const alpha = color === 'A' ? newValue : value.alpha;

        const newColor = new Color().setHsla(hue, saturation, lightness, alpha);
        this.color.set(newColor);
    }
}
