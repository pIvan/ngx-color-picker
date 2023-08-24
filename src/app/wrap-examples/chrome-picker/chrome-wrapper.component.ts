import { Component, OnInit, EventEmitter, Input, Output, HostBinding, HostListener } from '@angular/core';
import { ColorPickerControl, Color } from '@iplab/ngx-color-picker';

@Component({
    selector: 'chrome-wrapper',
    templateUrl: './chrome-wrapper.component.html',
    styleUrls: ['./chrome-wrapper.component.scss']
})
export class ChromeWrapperComponent implements OnInit {

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

    ngOnInit() {
    }

    @HostListener('click', ['$event'])
    public showColorPicker(event: MouseEvent) {
        if (this.isVisible === true) {
            return;
        }

        this.isVisible = !this.isVisible;
    }

    public applyClick(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isVisible = false;
        this._color = this.colorControl.value;
        this.colorChange.emit(this.colorControl.value.toHexString());
    }

}
