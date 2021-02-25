import { Component, Input, EventEmitter, Output, ChangeDetectionStrategy } from '@angular/core';
import { Color } from '../../../../helpers/color.class';


@Component({
    selector: `hex-input-component`,
    templateUrl: `./hex-input.component.html`,
    styleUrls: [
        `./../../base.style.scss`,
        `./../input.component.scss`,
        `./hex-input.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class HexComponent {

    @Input()
    public hue: Color;

    @Output()
    public hueChange = new EventEmitter<Color>(false);

    @Input()
    public color: Color;

    @Output()
    public colorChange = new EventEmitter<Color>(false);

    public labelVisible: boolean;
    private prefixValue: string = '';

    @Input()
    public set label(value) {
        this.labelVisible = true;
    }

    @Input()
    public set prefix(value) {
        this.prefixValue = value;
    }

    public get value() {
        return this.prefixValue + (this.color ? this.color.toHexString(this.color.getRgba().alpha < 1).replace('#', '') : '');
    }

    public onInputChange(inputValue: string): void {
        const value = inputValue.toLowerCase().replace('#', '');
        if (value.length === 3 || value.length === 6 || value.length === 8) {
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
                const hue = new Color().setHsva(newColor.getHsva().hue);
                this.hueChange.emit(hue);
                this.colorChange.emit(newColor);
            }
        }
    }
}
