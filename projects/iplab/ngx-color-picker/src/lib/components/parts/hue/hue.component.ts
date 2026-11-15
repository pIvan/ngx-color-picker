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
    Signal,
    InputSignalWithTransform
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

    public isVertical: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(false, { alias: 'vertical', transform: booleanAttribute });

    public readonly pointer: Signal<ElementRef> = viewChild.required<ElementRef>('pointer');

    private lastHue: number | null = null;
    private lastOrientation: 'top' | 'left' | null = null;

    constructor(private readonly renderer: Renderer2) {
        super();

        effect(() => {
            const hsva = this.color().getHsva();
            this.changePointerPosition(hsva.hue);
        });
    }

    protected movePointer({ x, y, height, width }: { x: number; y: number; height: number; width: number }): void {
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
        const orientation = this.isVertical() ? 'top' : 'left';
        if (hue === this.lastHue && orientation === this.lastOrientation) {
            return;
        }
        this.lastHue = hue;
        this.lastOrientation = orientation;
        const x = (hue / 360) * 100;
        this.renderer.setStyle(this.pointer().nativeElement, orientation, `${x}%`);
    }
}