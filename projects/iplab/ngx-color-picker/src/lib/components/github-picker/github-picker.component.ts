import {
    Component,
    OnInit,
    ChangeDetectionStrategy,
    OnDestroy,
    ChangeDetectorRef,
    HostBinding,
    model,
    ModelSignal,
    InputSignal,
    input,
    SimpleChanges,
    OnChanges,
} from '@angular/core';
import { ColorString } from './../../helpers/color.class';
import { ColorPickerControl } from './../../helpers/control.class';
import { getValueByType, isColorEqual } from './../../helpers/helper.functions';
import { Subscription } from 'rxjs';
import { ColorPresetsComponent } from '../parts/color-presets/color-presets.component';


export function columnAttribute(value: string | number | null | undefined): number | 'auto' {
    return !isNaN(parseFloat(value as any)) && !isNaN(Number(value))
            ? Number(value)
            : 'auto';
}

@Component({
    selector: `github-picker`,
    templateUrl: `./github-picker.component.html`,
    styleUrls: [
        `./../parts/base.style.scss`,
        `./github-picker.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    imports: [
        ColorPresetsComponent
    ]
})
export class GithubPickerComponent implements OnInit, OnChanges, OnDestroy {

    public color: ModelSignal<ColorString> = model<ColorString>();

    public control: InputSignal<ColorPickerControl> = input<ColorPickerControl>(new ColorPickerControl());

    public columns: InputSignal<'auto' | number> = input<'auto' | number, 'auto' | number>(8, { transform: columnAttribute });

    @HostBinding('style.width')
    public get width() {
        return this.columns() === 'auto' ? `auto` : `${25 * (this.columns() as number) + 12}px`;
    }

    public get columnsCount() {
        return this.columns() === 'auto' ? this.control().presets.length : this.columns();
    }
    
    private subscriptions: Array<Subscription> = [];

    constructor(private readonly cdr: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        if (this.color()) {
            this.control().setValueFrom(this.color());
        }

        if (!this.control().hasPresets()) {
            /**
             * set color presets
             * defined by github color picker component
             */
            this.control()
                .setColorPresets([
                    '#b80000', '#db3e00', '#fccb00', '#008b02', '#006b76', '#1273de', '#004dcf', '#5300eb',
                    '#eb9694', '#fad0c3', '#fef3bd', '#c1e1c5', '#bedadc', '#c4def6', '#bed3f3', '#d4c4fb'
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
