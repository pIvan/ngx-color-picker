import {
    Component,
    ChangeDetectionStrategy,
    Renderer2,
    ElementRef,
    effect,
    model,
    ModelSignal,
    viewChild,
    Signal
} from '@angular/core';
import { Color } from './../../../helpers/color.class';
import { BaseComponent } from './../base.component';


@Component({
    selector: `saturation-component`,
    templateUrl: `./saturation.component.html`,
    styleUrls: [
        `./../base.style.scss`,
        './saturation.component.scss'
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class SaturationComponent extends BaseComponent {

    public color: ModelSignal<Color> = model.required<Color>();

    public readonly pointer: Signal<ElementRef> = viewChild.required<ElementRef>('pointer');

    private lastX: number | null = null;
    private lastY: number | null = null;
    private lastHue: number | null = null;

    constructor(private readonly renderer: Renderer2) {
        super();

        /**
         * color can be changed through inputs
         * and then we need to move pointer
         */
        effect(() => {
            const color = this.color();
            if (!color) {
                return;
            }
            const hsva = color.getHsva();
            this.changePointerPosition(hsva.saturation, hsva.value);
            this.updateBackgroundColor(hsva.hue);
        });
    }

    protected movePointer({ x, y, height, width }: { x: number; y: number; height: number; width: number }): void {
        const saturation = (x * 100) / width;
        let bright = -((y * 100) / height) + 100;

        /**
         * prevent cursor jumping
         * when value is rgb(0,0,0) 
         */
        if (saturation > 10) {
            bright = bright < 1 ? 1 : bright;
        }

        this.changePointerPosition(saturation, bright);
        const color = this.color().getHsva();
        const newColor = new Color().setHsva(color.hue, saturation, bright, color.alpha);
        this.color.set(newColor);
    }

    private updateBackgroundColor(hue: number): void {
        if (hue === this.lastHue) {
            return;
        }
        this.lastHue = hue;
        const backgroundColor = new Color().setHsva(hue, 100, 100).toRgbString();
        this.renderer.setStyle(this.elementRef.nativeElement, 'backgroundColor', backgroundColor);
    }

    private changePointerPosition(x: number, y: number): void {
        if (x === this.lastX && y === this.lastY) {
            return;
        }
        this.lastX = x;
        this.lastY = y;
        const pointer = this.pointer().nativeElement;
        this.renderer.setStyle(pointer, 'top', `${100 - y}%`);
        this.renderer.setStyle(pointer, 'left', `${x}%`);
    }
}
