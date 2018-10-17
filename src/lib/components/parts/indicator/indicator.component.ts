import { Component, Input, HostBinding, HostListener, Renderer2, ElementRef, ChangeDetectionStrategy, Inject } from "@angular/core";
import { DOCUMENT } from "@angular/common";
import { Color } from "./../../../helpers/color.class";
import { ColorPickerConfig } from "./../../../services/color-picker.service";


@Component({
    selector: `indicator-component`,
    templateUrl: `./indicator.component.html`,
    styleUrls: [
        `./../base.style.scss`,
        `./indicator.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class IndicatorComponent {
    @Input()
    public color: Color;

    @Input()
    public colorType: 'rgba' | 'hex' | 'hsla' = 'rgba';

    @HostBinding('attr.title')
    public get title() {
        return this.pickerConfig ? this.pickerConfig.indicatorTitle : '';
    }

    constructor(
        private readonly pickerConfig: ColorPickerConfig,
        private readonly renderer: Renderer2, 
        private readonly elementRef: ElementRef,
        @Inject(DOCUMENT) private readonly document){
    }

    public get backgroundColor(): string {
        return this.color.toRgbaString();
    }

    @HostListener('click', ['$event'])
    public onClick(event: MouseEvent | TouchEvent) {
        const input = this.renderer.createElement('input');
        this.renderer.setStyle(input, 'position', 'absolute');
        this.renderer.setStyle(input, 'top', '-100%');
        this.renderer.setStyle(input, 'left', '-100%');

        switch(this.colorType) {
            case 'hsla':
                input.value = this.color.toHslaString();
                break;
            case 'hex':
                input.value = this.color.toHexString();
                break;
            default:
                input.value = this.backgroundColor;
        }

        this.renderer.appendChild(this.elementRef.nativeElement, input);
        input.select();
        this.document.execCommand('copy');
        this.renderer.removeChild(this.elementRef.nativeElement, input);
    }
}