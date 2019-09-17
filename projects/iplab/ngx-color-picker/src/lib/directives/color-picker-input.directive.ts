import { Directive, Input, Output, EventEmitter, HostListener } from '@angular/core';


@Directive({
    selector: '[inputChange]'
})
export class ColorPickerInputDirective {
    @Input()
    public min: string;

    @Input()
    public max: string;

    @Output()
    public inputChange = new EventEmitter<number>();

    @HostListener('input', ['$event'])
    public inputChanges(event: any): void {
        const element = event.target as HTMLInputElement || event.srcElement as HTMLInputElement;
        const value = element.value;

        const numeric = parseFloat(value);
        if (!isNaN(numeric) && numeric >= parseInt(this.min, 10) &&
            numeric <= parseInt(this.max, 10)) {
            this.inputChange.emit(numeric);
        }
    }
}
