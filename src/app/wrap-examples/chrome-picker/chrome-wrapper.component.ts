import { Component, OnInit, EventEmitter, Input, Output, HostBinding, HostListener } from '@angular/core';
import { ColorPickerControl, Color } from '@iplab/ngx-color-picker';

@Component({
    selector: 'chrome-wrapper',
    templateUrl: './chrome-wrapper.component.html',
    styleUrls: ['./chrome-wrapper.component.css']
})
export class ChromeWrapperComponent implements OnInit {

    public colorControl = new ColorPickerControl();

    public isVisible: boolean = false;

    @Input()
    public set color(color: string) {
        this.colorControl.setValueFrom(color);
    }

    @Output()
    public colorChange: EventEmitter<string> = new EventEmitter();

    @HostBinding('style.background-color')
    public get background(): string {
        return this.colorControl.value.toHexString();
    }

    ngOnInit() {
        this.colorControl.valueChanges.subscribe((value: Color) => this.colorChange.emit(value.toHexString()));
    }

    @HostListener('click', ['$event'])
    public showColorPicker(event: MouseEvent) {
        if (this.isVisible === true) {
            return;
        }

        this.isVisible = !this.isVisible;
    }

    public overlayClick(event: MouseEvent): void {
        event.preventDefault();
        event.stopPropagation();
        this.isVisible = false;
    }

}
