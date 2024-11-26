import { Component, OnInit, EventEmitter, Input, Output, HostBinding, HostListener, OnDestroy } from '@angular/core';
import { ColorPickerControl, Color, getValueByType, ChromePickerComponent } from '@iplab/ngx-color-picker';

@Component({
    selector: 'chrome-wrapper',
    templateUrl: './chrome-wrapper.component.html',
    styleUrls: ['./chrome-wrapper.component.scss'],
    imports: [ChromePickerComponent]
})
export class ChromeWrapperComponent implements OnInit, OnDestroy {

    private _color: Color = null;

    public colorControl = new ColorPickerControl();

    public isVisible: boolean = false;

    @Input()
    public set color(color: string) {
        this.colorControl.setValueFrom(color);
        this._color = this.colorControl.value;
    }

    @Output()
    public colorChange: EventEmitter<string> = new EventEmitter();

    @HostBinding('style.background-color')
    public get background(): string {
        return this._color ? this._color.toHexString() : null;
    }

    constructor() {}

    public ngOnInit(): void {
    }

    public ngOnDestroy(): void {
    }

    @HostListener('click', ['$event'])
    public showColorPicker(event: MouseEvent) {
        if (this.isVisible === true) {
            return;
        }

        this.isVisible = !this.isVisible;
    }

    public applyClick(event: MouseEvent): void {
        event.stopPropagation();
        this._color = this.colorControl.value;
        this.colorChange.emit(getValueByType(this.colorControl.value, this.colorControl.initType));
        this.isVisible = false;
    }

    public discardClick(event: MouseEvent): void {
        event.stopPropagation();
        this.isVisible = false;
    }
}
