import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    OnDestroy,
    ChangeDetectorRef,
    ModelSignal,
    model,
    OnChanges,
    SimpleChanges
} from '@angular/core';
import { ColorString } from './../../helpers/color.class';
import { ColorPickerControl } from './../../helpers/control.class';
import { getValueByType, isColorEqual } from './../../helpers/helper.functions';
import { Subscription } from 'rxjs';
import { ColorPresetsComponent } from '../parts/color-presets/color-presets.component';

@Component({
    selector: `swatches-picker`,
    templateUrl: `./swatches-picker.component.html`,
    styleUrls: [
        `./../parts/base.style.scss`,
        `./swatches-picker.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        ColorPresetsComponent
    ]
})
export class SwatchesPickerComponent implements OnInit, OnChanges, OnDestroy {

    public color: ModelSignal<ColorString> = model<ColorString>();

    public control: ColorPickerControl = new ColorPickerControl();
    public childControl: ColorPickerControl = new ColorPickerControl();
    private subscriptions: Array<Subscription> = [];

    private mapColors = {
        '#E6315B': [
            '#fc8da7', '#fa7d9a', '#f56484', '#f04a71', '#e82c58', '#e31746', '#de0235',
            '#d60234', '#d10232', '#c70230', '#b8022c', '#ab0229', '#9c0225', '#8f0122',
            '#8c0122', '#82011f', '#78011b', '#690117', '#5c0012', '#4f0010', '#42000c'
        ],
        '#793183': [
            '#ef8dfc', '#eb7dfa', '#e664f5', '#dc4af0', '#d22ce8', '#cb17e3', '#c402de',
            '#c002d9', '#bb02d4', '#b002c7', '#a202b8', '#9702ab', '#8a029c', '#7e018f',
            '#7a018a', '#730182', '#6c0178', '#5e0169', '#54015c', '#49014f', '#3d0142'
        ],
        '#009DE7': [
            '#8dd9fc', '#7dd2fa', '#64c7f5', '#4abbf0', '#2cade8', '#17a2e3', '#0298de',
            '#0295d9', '#0291d4', '#0289c7', '#027eb8', '#0275ab', '#026b9c', '#01628f',
            '#015f8a', '#015982', '#015278', '#014869', '#013f5c', '#01364f', '#012e42'
        ],
        '#00B59C': [
            '#8dfeea', '#7dfbe4', '#63f4db', '#4befd2', '#2de7c6', '#16e2be', '#03deb7',
            '#01ddb6', '#01d4ae', '#01c7a4', '#01b897', '#01aa8b', '#019b80', '#019076',
            '#018c73', '#01836c', '#017763', '#016857', '#005c4e', '#005044', '#004239'
        ],
        '#FFCE00': [
            '#fce68d', '#fae17d', '#f5da64', '#f0cf4a', '#e8c22c', '#e5bc17', '#deb202',
            '#deb100', '#d4aa02', '#c7a002', '#b89302', '#ab8902', '#9c7d02', '#8f7301',
            '#8c7001', '#826801', '#786201', '#695601', '#5c4b00', '#4f4100', '#423700'
        ],
        '#FF4A21': [
            '#fca28d', '#fa947d', '#f57f64', '#f0694a', '#e84f2c', '#e33c17', '#de2a02',
            '#d92a02', '#d42902', '#c72602', '#b82302', '#ab2102', '#9c1e02', '#8f1b01',
            '#8a1a01', '#821901', '#781701', '#691300', '#5c1100', '#4f0e00', '#420c00'
        ],
        '#D6D5D6': [
            '#fff', '#f2f2f2', '#e5e5e5', '#d9d9d9', '#cccccc', '#bfbfbf', '#b3b3b3',
            '#a6a6a6', '#999999', '#8c8c8c', '#808080', '#737373', '#666666', '#595959',
            '#4d4d4d', '#424242', '#363636', '#262626', '#1a1a1a', '#0f0f0f', '#000'
        ]
    };

    constructor(private readonly cdr: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        if (this.color()) {
            this.childControl.setValueFrom(this.color());
        } else {
            this.control.setValueFrom('#E6315B');
        }

        /**
         * set color presets
         * defined by swatches color picker component
         */
        this.control.setColorPresets([
            '#e6315b', '#793183', '#009de7', '#00b59c', '#ffce00', '#ff4a21', '#d6d5d6'
        ]);

        /**
         * initially open first group
         */
        this.childControl.setColorPresets(this.mapColors['#E6315B']);

        this.subscriptions.push(
            this.childControl.valueChanges.subscribe((value) => {
                this.color.set(getValueByType(value, this.childControl.initType));
            })
        );

        this.subscriptions.push(
            this.control.valueChanges.subscribe((value) => {
                const presets = this.mapColors[value.toHexString()];
                if (presets) {
                    this.childControl.setColorPresets(presets);
                }
                this.color.set(getValueByType(this.childControl.value, this.childControl.initType));
                this.cdr.detectChanges();
            })
        );
    }

    public ngOnChanges(changes: SimpleChanges): void {
        /**
         * trigger only if color binding is changed
         */
        const color = this.color();
        const control = this.control;

        if (color && control && !isColorEqual(getValueByType(control.value, control.initType), color)) {
            this.childControl.setValueFrom(color);
        }
    }

    public ngOnDestroy(): void {
        this.cdr.detach();
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }
}
