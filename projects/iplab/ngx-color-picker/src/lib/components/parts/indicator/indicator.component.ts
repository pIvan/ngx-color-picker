import { Component, Renderer2, ElementRef, ChangeDetectionStrategy, Inject, OnInit, InputSignal, input, effect, viewChild, Signal, DOCUMENT } from '@angular/core';

import { Color } from './../../../helpers/color.class';
import { ColorPickerConfig } from './../../../services/color-picker.service';
import { fromEvent, Subscription } from 'rxjs';


@Component({
    selector: `indicator-component`,
    templateUrl: `./indicator.component.html`,
    styleUrls: [
        `./../base.style.scss`,
        `./indicator.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class IndicatorComponent implements OnInit {

    public color: InputSignal<Color> = input.required<Color>();

    public colorType: InputSignal<'rgba' | 'hex' | 'hsla'> = input<'rgba' | 'hex' | 'hsla'>('rgba');

    public readonly backgroundColorEl: Signal<ElementRef<HTMLDivElement>> = viewChild.required<ElementRef<HTMLDivElement>>('backgroundColorEl')

    private subscriptions: Subscription[] = [];

    constructor(
        private readonly pickerConfig: ColorPickerConfig,
        private readonly renderer: Renderer2,
        private readonly elementRef: ElementRef,
        @Inject(DOCUMENT) private readonly document) {
            this.renderTitle();

            effect(() => {
                this.renderBackgroundColor();
            })
    }

    public ngOnInit(): void {
        this.subscriptions.push(
            fromEvent(this.elementRef.nativeElement, 'click').subscribe(() => this.onClick())
        );
    }

    private renderTitle(): void {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'title', this.pickerConfig?.indicatorTitle || '');
    }

    private renderBackgroundColor(): void {
        if (!this.backgroundColorEl()) {
            return;
        }
        this.renderer.setStyle(this.backgroundColorEl().nativeElement, 'backgroundColor', this.color().toRgbaString());
    }

    private onClick() {
        const input = this.renderer.createElement('input');
        this.renderer.setStyle(input, 'position', 'absolute');
        this.renderer.setStyle(input, 'top', '-100%');
        this.renderer.setStyle(input, 'left', '-100%');

        switch (this.colorType()) {
            case 'hsla':
                input.value = this.color().toHslaString();
                break;
            case 'hex':
                input.value = this.color().toHexString(this.color().getRgba().alpha < 1);
                break;
            default:
                input.value = this.color().toRgbaString();
        }

        this.renderer.appendChild(this.elementRef.nativeElement, input);
        input.select();
        this.document.execCommand('copy');
        this.renderer.removeChild(this.elementRef.nativeElement, input);
    }
}
