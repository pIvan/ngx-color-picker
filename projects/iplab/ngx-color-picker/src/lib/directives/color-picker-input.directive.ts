import { Directive, Input, Output, EventEmitter, HostListener, input, InputSignal, OutputEmitterRef, output, numberAttribute, ElementRef, Renderer2 } from '@angular/core';


@Directive({
    selector: '[inputChange]',
    standalone: true
})
export class ColorPickerInputDirective {

    public min: InputSignal<number> = input<number, number>(0, { transform: numberAttribute });

    public max: InputSignal<number> = input<number, number>(255, { transform: numberAttribute });

    public inputChange: OutputEmitterRef<number> = output<number>();

    @HostListener('input', ['$event'])
    public inputChanges(event: any): void {
        const element = event.target as HTMLInputElement || event.srcElement as HTMLInputElement;
        const value = element.value;

        const numeric = parseFloat(value);
        if (!isNaN(numeric) && numeric >= this.min() && numeric <= this.max()) {
            this.inputChange.emit(numeric);
        }
    }
}
