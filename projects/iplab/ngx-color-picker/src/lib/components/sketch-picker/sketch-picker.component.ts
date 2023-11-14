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
    selector: `sketch-picker`,
    templateUrl: `./sketch-picker.component.html`,
    styleUrls: [
        `./../parts/base.style.scss`,
        `./sketch-picker.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class SketchPickerComponent implements OnInit, OnChanges, OnDestroy {

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

        if (!this.control.hasPresets()) {
            /**
             * set color presets
             * defined by sketch color picker component
             */
            this.control
                .setColorPresets([
                    '#d0041b', '#8b572a', '#f5a623', '#f8e71c', '#7ed321', '#417506', '#bd10e0', '#9013fe',
                    '#4a90e2', '#50e3c2', '#b8e986', '#030303', '#4a4a4a', '#9b9b9b', '#fff'
                ]);
        }

        this.subscriptions.push(
            this.control.valueChanges.subscribe((value) => {
                this.cdr.detectChanges();
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
