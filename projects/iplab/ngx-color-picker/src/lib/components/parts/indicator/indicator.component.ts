import { Component, Renderer2, ElementRef, ChangeDetectionStrategy, Inject, OnInit, OnDestroy, InputSignal, input, effect, viewChild, Signal, DOCUMENT, NgZone, inject } from '@angular/core';
import { fromEvent, Subscription } from 'rxjs';

import { Color } from './../../../helpers/color.class';
import { ColorPickerConfig } from './../../../services/color-picker.service';


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
export class IndicatorComponent implements OnInit, OnDestroy {

    public color: InputSignal<Color> = input.required<Color>();

    public colorType: InputSignal<'rgba' | 'hex' | 'hsla'> = input<'rgba' | 'hex' | 'hsla'>('rgba');

    public readonly backgroundColorEl: Signal<ElementRef<HTMLDivElement>> = viewChild.required<ElementRef<HTMLDivElement>>('backgroundColorEl')

    private readonly ngZone = inject(NgZone);
    private subscriptions: Subscription[] = [];

    constructor(
        private readonly pickerConfig: ColorPickerConfig,
        private readonly renderer: Renderer2,
        private readonly elementRef: ElementRef,
        @Inject(DOCUMENT) private readonly document: HTMLDocument) {
            this.renderTitle();

            effect(() => {
                this.renderBackgroundColor();
            })
    }

    public ngOnInit(): void {
        this.ngZone.runOutsideAngular(() => {
            this.subscriptions.push(
                fromEvent(this.elementRef.nativeElement, 'click').subscribe(() => this.onClick())
            );
        });
    }

    public ngOnDestroy(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
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
