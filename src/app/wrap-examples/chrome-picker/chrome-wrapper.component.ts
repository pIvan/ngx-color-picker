import { Component, OnInit, OnDestroy, ChangeDetectionStrategy, input, InputSignal, output, OutputEmitterRef, computed, Signal } from '@angular/core';
import { ColorPickerControl, Color, getValueByType, ChromePickerComponent } from '@iplab/ngx-color-picker';

@Component({
    selector: 'chrome-wrapper',
    templateUrl: './chrome-wrapper.component.html',
    styleUrls: ['./chrome-wrapper.component.scss'],
    changeDetection: ChangeDetectionStrategy.Eager,
    imports: [ChromePickerComponent],
    host: {
        'style.background-color': 'background()',
        '(click)': 'showColorPicker($event)'
    }
})
export class ChromeWrapperComponent implements OnInit, OnDestroy {

    private _color: Color | null = null;

    protected isVisible: boolean = false;

    protected background: Signal<string | null> = computed(() => {
        return this._color ? this._color.toHexString() : null;
    });

    protected colorControl = new ColorPickerControl();

    public color: InputSignal<string> = input<string, string>('', { transform: (value: string) => {
            this.colorControl.setValueFrom(value);
            this._color = this.colorControl.value;
            return value;
        }
    });

    public colorChange: OutputEmitterRef<string> = output<string>();

    constructor() {}

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
    }

    protected showColorPicker(event: MouseEvent) {
        if (this.isVisible === true) {
            return;
        }

        this.isVisible = !this.isVisible;
    }

    protected applyClick(event: MouseEvent): void {
        event.stopPropagation();
        this._color = this.colorControl.value;
        this.colorChange.emit(getValueByType(this.colorControl.value, this.colorControl.initType));
        this.isVisible = false;
    }

    protected discardClick(event: MouseEvent): void {
        event.stopPropagation();
        this.isVisible = false;
    }
}
