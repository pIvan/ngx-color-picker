import { Component, ChangeDetectionStrategy, InputSignal, input, numberAttribute, model, ModelSignal } from '@angular/core';
import { NgClass } from '@angular/common';
import { Color } from './../../../helpers/color.class';
import { ColorPresetSublist } from './../color-preset-sublist/color-preset-sublist.component';
import { ColorPresetComponent } from './../color-preset/color-preset.component';
import { ChunksPipe } from './../../../pipes/chunks.pipe';

@Component({
    selector: `color-presets-component`,
    templateUrl: `./color-presets.component.html`,
    styleUrls: [
        `./../base.style.scss`,
        `./color-presets.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [ColorPresetComponent, ColorPresetSublist, NgClass, ChunksPipe],
})
export class ColorPresetsComponent {

    public columns: InputSignal<number> = input<number, number>(8, { transform: numberAttribute });

    public colorPresets: InputSignal<Array<Array<Color> | Color>> = input.required<Array<Array<Color> | Color>>();

    public color: ModelSignal<Color> = model.required<Color>();

    public direction: InputSignal<'down' | 'up' | 'left' | 'right'> = input<'down' | 'up' | 'left' | 'right'>('up');

    public onSelectionChange(color: Color): void {
        const selectedRgbaColor = color.getRgba();

        const newColor = new Color()
            .setRgba(selectedRgbaColor.red, selectedRgbaColor.green, selectedRgbaColor.blue, selectedRgbaColor.alpha);
        this.color.set(newColor);
    }

    public isList(colorPreset: Array<Array<Color> | Color>): boolean {
        return Array.isArray(colorPreset);
    }
}