import { Component, ChangeDetectionStrategy, booleanAttribute, InputSignal, input, model, ModelSignal } from '@angular/core';
import { Color } from '../../../../helpers/color.class';


@Component({
    selector: `hex-input-component`,
    templateUrl: `./hex-input.component.html`,
    styleUrls: [
        `./../../base.style.scss`,
        `./../input.component.scss`,
        `./hex-input.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class HexComponent {

    public color: ModelSignal<Color> = model.required<Color>();

    public labelVisible: InputSignal<boolean> = input<boolean, boolean>(false, { alias: 'label', transform: booleanAttribute });

    public prefixValue: InputSignal<string> = input<string>('', { alias: 'prefix' });

    public get value() {
        return this.prefixValue() + (this.color() ? this.color().toHexString(this.color().getRgba().alpha < 1).replace('#', '') : '');
    }

    public onInputChange(event: KeyboardEvent, inputValue: string): void {
        const value = inputValue.toLowerCase().replace('#', '');

        if (
        ((event.keyCode === 13 || event.key.toLowerCase() === 'enter') && value.length === 3)
        || value.length === 6 || value.length === 8) {
            const hex = parseInt(value, 16);
            const hexStr = hex.toString(16);

            /**
             * if value is valid
             * change color else do nothing
             * after parsing number leading 0 is removed,
             * compare length and add leading 0 before comparing two values
             */
            if (hexStr.padStart(value.length, '0') === value && this.value !== value) {
                const newColor = new Color(`#${value}`);
                this.color.set(newColor);
            }
        }
    }
}
