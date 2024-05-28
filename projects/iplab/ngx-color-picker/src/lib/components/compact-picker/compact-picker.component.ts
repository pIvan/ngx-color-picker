import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    OnDestroy,
    ChangeDetectorRef,
    model,
    ModelSignal,
    InputSignal,
    input,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ColorPickerControl } from './../../helpers/control.class';
import { getValueByType, isColorEqual } from './../../helpers/helper.functions';
import { Subscription } from 'rxjs';
import { SaturationComponent } from './../parts/saturation/saturation.component';
import { IndicatorComponent } from './../parts/indicator/indicator.component';
import { HueComponent } from './../parts/hue/hue.component';
import { HexComponent } from './../parts/inputs/hex-input/hex-input.component';
import { ColorPresetsComponent } from '../parts/color-presets/color-presets.component';
import { ColorString } from '../../helpers/color.class';

@Component({
    selector: `compact-picker`,
    templateUrl: `./compact-picker.component.html`,
    styleUrls: [
        `./../parts/base.style.scss`,
        `./compact-picker.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        SaturationComponent,
        IndicatorComponent,
        HueComponent,
        ColorPresetsComponent,
        HexComponent,
        AsyncPipe
    ]
})
export class CompactPickerComponent implements OnInit, OnChanges, OnDestroy {

    public color: ModelSignal<ColorString> = model<ColorString>();

    public control: InputSignal<ColorPickerControl> = input<ColorPickerControl>(new ColorPickerControl());

    private subscriptions: Array<Subscription> = [];

    constructor(private readonly cdr: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        if (this.color()) {
            this.control().setValueFrom(this.color());
        }

        /**
         * set color presets
         * defined by compact color picker component
         */
        if (!this.control().hasPresets()) {
            this.control()
                .setColorPresets([
                    '#6da6e8', '#74c283', '#f9d948', '#f5943f', '#f66c6c', '#ef8ab8', '#696cd4', '#6c6c6c', '#f6f5f5'
                ]);
        }

        this.subscriptions.push(
            this.control().valueChanges.subscribe((value) => {
                this.color.set(getValueByType(value, this.control().initType));
                this.cdr.detectChanges();
            })
        );
    }

    public ngOnChanges(changes: SimpleChanges): void {
        /**
         * trigger only if color binding is changed
         */
        const color = this.color();
        const control = this.control();
        if (color && control && !isColorEqual(getValueByType(control.value, control.initType), color)) {
            control.setValueFrom(color);
        }
    }

    public ngOnDestroy(): void {
        this.cdr.detach();
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }
}