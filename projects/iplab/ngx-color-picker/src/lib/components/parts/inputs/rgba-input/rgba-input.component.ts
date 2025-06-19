import { Component, ChangeDetectionStrategy, booleanAttribute, input, model, ModelSignal, InputSignalWithTransform } from '@angular/core';
import { Color } from './../../../../helpers/color.class';
import { ColorPickerInputDirective } from '../../../../directives/color-picker-input.directive';


@Component({
    selector: `rgba-input-component`,
    templateUrl: `./rgba-input.component.html`,
    styleUrls: [
        `./../../base.style.scss`,
        `./../input.component.scss`,
        `./rgba-input.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ColorPickerInputDirective]
})
export class RgbaComponent {

    public color: ModelSignal<Color> = model.required<Color>();

    public labelVisible: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(false, { alias: 'label', transform: booleanAttribute });

    public isAlphaVisible: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(true, { alias: 'alpha', transform: booleanAttribute });

    public get value() {
        return this.color()?.getRgba();
    }

    public onInputChange(newValue: number, color: 'R' | 'G' | 'B' | 'A') {
        const value = this.value;
        const red = color === 'R' ? newValue : value.red;
        const green = color === 'G' ? newValue : value.green;
        const blue = color === 'B' ? newValue : value.blue;
        const alpha = color === 'A' ? newValue : value.alpha;

        const newColor = new Color().setRgba(red, green, blue, alpha);
        this.color.set(newColor);
    }
}
