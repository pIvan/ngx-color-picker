import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    SimpleChanges,
    ChangeDetectionStrategy,
    OnChanges,
    OnDestroy,
    ChangeDetectorRef,
    ModelSignal,
    model,
    input,
    InputSignal,
    effect
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ColorString } from './../../helpers/color.class';
import { ColorPickerControl } from './../../helpers/control.class';
import { getValueByType } from './../../helpers/helper.functions';
import { Subscription } from 'rxjs';
import { SaturationComponent } from './../parts/saturation/saturation.component';
import { IndicatorComponent } from './../parts/indicator/indicator.component';
import { HueComponent } from './../parts/hue/hue.component';
import { AlphaComponent } from './../parts/alpha/alpha.component';
import { RgbaComponent } from './../parts/inputs/rgba-input/rgba-input.component';
import { HexComponent } from './../parts/inputs/hex-input/hex-input.component';
import { ColorPresetsComponent } from '../parts/color-presets/color-presets.component';

@Component({
    selector: `sketch-picker`,
    templateUrl: `./sketch-picker.component.html`,
    styleUrls: [
        `./../parts/base.style.scss`,
        `./sketch-picker.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        SaturationComponent,
        IndicatorComponent,
        HueComponent,
        AlphaComponent,
        HexComponent,
        RgbaComponent,
        ColorPresetsComponent,
        AsyncPipe
    ]
})
export class SketchPickerComponent implements OnInit, OnDestroy {

    public color: ModelSignal<ColorString> = model<ColorString>();

    public control: InputSignal<ColorPickerControl> = input<ColorPickerControl>(new ColorPickerControl());

    private subscriptions: Array<Subscription> = [];

    constructor(private readonly cdr: ChangeDetectorRef) {
        effect(() => {
            const color = this.color();
            const control = this.control();
            if (color && control && getValueByType(control.value, control.initType) !== color) {
                control.setValueFrom(color);
            }
        });
    }

    public ngOnInit(): void {
        if (this.color()) {
            this.control().setValueFrom(this.color());
        }

        if (!this.control().hasPresets()) {
            /**
             * set color presets
             * defined by sketch color picker component
             */
            this.control()
                .setColorPresets([
                    '#d0041b', '#8b572a', '#f5a623', '#f8e71c', '#7ed321', '#417506', '#bd10e0', '#9013fe',
                    '#4a90e2', '#50e3c2', '#b8e986', '#030303', '#4a4a4a', '#9b9b9b', '#fff'
                ]);
        }

        this.subscriptions.push(
            this.control().valueChanges.subscribe((value) => {
                this.cdr.detectChanges();
                this.color.set(getValueByType(value, this.control().initType));
            })
        );
    }

    public ngOnDestroy(): void {
        this.cdr.detach();
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }
}
