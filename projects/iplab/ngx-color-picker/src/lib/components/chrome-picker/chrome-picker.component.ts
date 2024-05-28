import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    OnDestroy,
    ChangeDetectorRef,
    model,
    ModelSignal,
    input,
    InputSignal,
    SimpleChanges,
    OnChanges
} from '@angular/core';
import { AsyncPipe } from '@angular/common';
import { ColorPickerControl } from './../../helpers/control.class';
import { getValueByType, isColorEqual } from './../../helpers/helper.functions';
import { Subscription } from 'rxjs';
import { SaturationComponent } from './../parts/saturation/saturation.component';
import { IndicatorComponent } from './../parts/indicator/indicator.component';
import { HueComponent } from './../parts/hue/hue.component';
import { AlphaComponent } from './../parts/alpha/alpha.component';
import { RgbaComponent } from './../parts/inputs/rgba-input/rgba-input.component';
import { HslaComponent } from './../parts/inputs/hsla-input/hsla-input.component';
import { HexComponent } from './../parts/inputs/hex-input/hex-input.component';
import { ColorPresetsComponent } from '../parts/color-presets/color-presets.component';
import { ColorString } from '../../helpers/color.class';


@Component({
    selector: `chrome-picker`,
    templateUrl: `./chrome-picker.component.html`,
    styleUrls: [
        `./../parts/base.style.scss`,
        `./chrome-picker.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        SaturationComponent,
        IndicatorComponent,
        HueComponent,
        AlphaComponent,
        RgbaComponent,
        HslaComponent,
        HexComponent,
        ColorPresetsComponent,

        AsyncPipe
    ]
})
export class ChromePickerComponent implements OnInit, OnChanges, OnDestroy {

    public selectedPresentation: number = 0;
    public presentations = ['rgba', 'hsla', 'hex'];

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
         * defined by this chrome color picker component
         */
        if (!this.control().hasPresets()) {
            this.control()
                .setColorPresets([
                    ['#f44336', '#ffebee', '#ffcdd2', '#EF9A9A', '#E57373', '#EF5350', '#F44336', '#E53935', '#D32F2F', '#C62828', '#B71C1C'],
                    ['#E91E63', '#fce4ec', '#f8bbd0', '#f48fb1', '#f06292', '#ec407a', '#e91e63', '#d81b60', '#c2185b', '#ad1457', '#880e4f'],
                    ['#9C27B0', '#F3e5f5', '#e1bee7', '#ce93d8', '#ba68c8', '#ab47bc', '#9c27b0', '#8e24aa', '#7b1fa2', '#6a1b9a', '#4a148c'],
                    ['#673AB7', '#ede7f6', '#d1c4e9', '#b39ddb', '#9575cd', '#7e57c2', '#673ab7', '#5e35b1', '#512da8', '#4527a0', '#311b92'],
                    ['#3F51B5', '#e8eaf6', '#c5cae9', '#9fa8da', '#7986cb', '#5c6bc0', '#3f51b5', '#3949ab', '#303f9f', '#283593', '#1a237e'],
                    ['#2196F3', '#e3f2fd', '#bbdefb', '#90caf9', '#64b5f6', '#42a5f5', '#2196f3', '#1e88e5', '#1976d2', '#1565c0', '#0D47a1'],
                    ['#03A9F4', '#e1f5fe', '#b3e5fc', '#81d4fa', '#4fc3f7', '#29b6f6', '#03a9f4', '#039be5', '#0288d1', '#0277bd', '#01579b'],
                    ['#00BCD4', '#e0f7fa', '#b2ebf2', '#80deea', '#4dd0e1', '#26c6da', '#00bcd4', '#00acc1', '#0097a7', '#00838f', '#006064'],
                    ['#009688', '#E0F2f1', '#b2dfdb', '#80cbc4', '#4db6ac', '#26a69a', '#009688', '#00897b', '#00796b', '#00695c', '#004d40'],
                    ['#4CAF50', '#e8f5e9', '#c8e6c9', '#a5d6a7', '#81c784', '#66bb6a', '#4caf50', '#43a047', '#388e3c', '#2e7d32', '#1b5e20'],
                    ['#8BC34A', '#f1f8e9', '#dcedc8', '#c5e1a5', '#aed581', '#9ccc65', '#8bc34a', '#7cb342', '#689f38', '#558b2f', '#33691e'],
                    ['#cddc39', '#f9fbe7', '#f0f4c3', '#e6ee9c', '#dce775', '#d4e157', '#c0dc39', '#c0ca33', '#afb42b', '#9e9d24', '#827717'],
                    ['#ffeb3b', '#fffde7', '#fff9c4', '#fff59d', '#fff176', '#ffee58', '#ffeb3b', '#fdd835', '#fbc02d', '#f9a825', '#f57f17'],
                    ['#ffc107', '#fff8e1', '#ffecb3', '#ffe082', '#ffd54f', '#ffca28', '#ffc107', '#ffb300', '#ffa000', '#ff8f00', '#ff6f00'],
                    ['#ff9800', '#fff3e0', '#ffe0b2', '#ffcc80', '#ffb74d', '#ffa726', '#ff9800', '#fb8c00', '#f57c00', '#ef6c00', '#e65100'],
                    ['#ff5722', '#fbe9e7', '#ffccbc', '#ffab91', '#ff8a65', '#ff7043', '#ff5722', '#f4511e', '#e64a19', '#d84315', '#bf360c'],
                    ['#795548', '#efebe9', '#d7ccc8', '#bcaaa4', '#a1887f', '#8d6e63', '#795548', '#6d4c41', '#5d4037', '#4e342e', '#3e2723'],
                    ['#9e9e9e', '#fafafa', '#f5f5f5', '#eee', '#e0e0e0', '#bdbdbd', '#9e9e9e', '#757575', '#616161', '#424242', '#212121'],
                    ['#607d8b', '#eceff1', '#cfd8dc', '#b0bec5', '#90a4ae', '#78909c', '#60708b', '#546e7a', '#455a64', '#37474f', '#263238']
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

    public changePresentation(): void {
        this.selectedPresentation =
            this.selectedPresentation === this.presentations.length - 1 ? 0 : this.selectedPresentation + 1;
    }

}
