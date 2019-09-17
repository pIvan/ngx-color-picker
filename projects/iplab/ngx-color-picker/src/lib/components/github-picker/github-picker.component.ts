import {
    Component,
    OnInit,
    Input,
    Output,
    EventEmitter,
    OnChanges,
    SimpleChanges,
    ChangeDetectionStrategy,
    OnDestroy,
    ChangeDetectorRef,
    HostBinding
} from '@angular/core';
import { ColorString } from './../../helpers/color.class';
import { ColorPickerControl } from './../../helpers/control.class';
import { getValueByType } from './../../helpers/helper.functions';

@Component({
    selector: `github-picker`,
    templateUrl: `./github-picker.component.html`,
    styleUrls: [
        `./../parts/base.style.scss`,
        `./github-picker.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class GithubPickerComponent implements OnInit, OnChanges, OnDestroy {

    @Input()
    public color: string;

    @Input()
    public control: ColorPickerControl;

    @Input()
    public columns: number | 'auto' = 8;

    @Output()
    public colorChange: EventEmitter<ColorString> = new EventEmitter(false);

    @HostBinding('style.width') get widht() {
        return this.columns === 'auto' ? `auto` : `${25 * this.columns + 12}px`;
    }

    public get columnsCount() {
        return this.columns === 'auto' ? this.control.presets.length : this.columns;
    }

    constructor(private readonly cdr: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        if (!this.control) {
            this.control = new ColorPickerControl();
        }

        if (this.color) {
            this.control.setValueFrom(this.color);
        }

        if (!this.control.hasPresets()) {
            /**
             * set color presets
             * defined by github color picker component
             */
            this.control
                .setColorPresets([
                    '#b80000', '#db3e00', '#fccb00', '#008b02', '#006b76', '#1273de', '#004dcf', '#5300eb',
                    '#eb9694', '#fad0c3', '#fef3bd', '#c1e1c5', '#bedadc', '#c4def6', '#bed3f3', '#d4c4fb'
                ]);
        }

        this.control.valueChanges.subscribe((value) => {
            this.cdr.markForCheck();
            this.colorChange.emit(getValueByType(value, this.control.initType));
        });
    }

    public ngOnDestroy(): void {
        this.control.unsubscribe();
        this.cdr.detach();
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.color && this.control && getValueByType(this.control.value, this.control.initType) !== this.color) {
            this.control.setValueFrom(this.color);
        }
    }
}