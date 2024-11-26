import {
    Component,
    ChangeDetectionStrategy,
    Renderer2,
    ElementRef,
    booleanAttribute,
    InputSignal,
    input,
    effect,
    model,
    ModelSignal,
    viewChild,
    Signal
} from '@angular/core';
import { Color } from './../../../helpers/color.class';
import { BaseComponent } from './../base.component';

@Component({
    selector: `hue-component`,
    templateUrl: `./hue.component.html`,
    styleUrls: [
        `./../base.style.scss`,
        `./hue.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class HueComponent extends BaseComponent {

    public color: ModelSignal<Color> = model.required<Color>();

    public isVertical: InputSignal<boolean> = input<boolean, boolean>(false, { alias: 'vertical', transform: booleanAttribute });

    public readonly pointer: Signal<ElementRef> = viewChild.required<ElementRef>('pointer');

    constructor(private readonly renderer: Renderer2) {
        super();

        effect(() => {
            const hsva = this.color().getHsva();
            this.changePointerPosition(hsva.hue);
        })
    }

    protected movePointer({ x, y, height, width }): void {
        const hue = this.isVertical() ? (y / height) * 359 : (x / width) * 359;
        this.changePointerPosition(hue);

        const currentColor = this.color().getHsva();
        const newHueColor = new Color().setHsva(hue, currentColor.saturation, currentColor.value, currentColor.alpha);
        this.color.set(newHueColor);
    }

    /**
     * hue value is in range from 0 to 360°
     */
    private changePointerPosition(hue: number): void {
        const x = (hue / 360) * 100;
        const orientation = this.isVertical() ? 'top' : 'left';
        this.renderer.setStyle(this.pointer().nativeElement, orientation, `${x}%`);
    }
}