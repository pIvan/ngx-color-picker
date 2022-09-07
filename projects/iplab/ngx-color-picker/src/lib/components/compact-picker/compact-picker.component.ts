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
    ChangeDetectorRef
} from '@angular/core';
import { ColorString } from './../../helpers/color.class';
import { ColorPickerControl } from './../../helpers/control.class';
import { getValueByType } from './../../helpers/helper.functions';
import { Subscription } from 'rxjs';

@Component({
    selector: `compact-picker`,
    templateUrl: `./compact-picker.component.html`,
    styleUrls: [
        `./../parts/base.style.scss`,
        `./compact-picker.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class CompactPickerComponent implements OnInit, OnChanges, OnDestroy {

    @Input()
    public color: string;

    @Input()
    public control: ColorPickerControl;

    @Output()
    public colorChange: EventEmitter<ColorString> = new EventEmitter(false);

    private subscriptions: Array<Subscription> = [];

    constructor(private readonly cdr: ChangeDetectorRef) {
    }

    public ngOnInit(): void {
        if (!this.control) {
            this.control = new ColorPickerControl();
        }

        if (this.color) {
            this.control.setValueFrom(this.color);
        }

        /**
         * set color presets
         * defined by compact color picker component
         */
        if (!this.control.hasPresets()) {
            this.control
                .setColorPresets([
                    '#6da6e8', '#74c283', '#f9d948', '#f5943f', '#f66c6c', '#ef8ab8', '#696cd4', '#6c6c6c', '#f6f5f5'
                ]);
        }

        this.subscriptions.push(
            this.control.valueChanges.subscribe((value) => {
                this.cdr.markForCheck();
                this.colorChange.emit(getValueByType(value, this.control.initType));
            })
        );
    }

    public ngOnDestroy(): void {
        this.cdr.detach();
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }

    public ngOnChanges(changes: SimpleChanges): void {
        if (this.color && this.control && getValueByType(this.control.value, this.control.initType) !== this.color) {
            this.control.setValueFrom(this.color);
        }
    }
}