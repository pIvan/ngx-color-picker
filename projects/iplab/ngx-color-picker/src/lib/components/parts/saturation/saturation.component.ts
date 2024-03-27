import {
    Component,
    ChangeDetectionStrategy,
    Renderer2,
    ElementRef,
    ViewChild,
    effect,
    model,
    ModelSignal
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

    @ViewChild('pointer', { static: true })
    public pointer: ElementRef;

    constructor(private readonly renderer: Renderer2) {
        super();

        /**
         * color can be changed through inputs
         * and then we need to move pointer
         */
        effect(() => {
            const hsva = this.color().getHsva();
            this.changePointerPosition(hsva.saturation, hsva.value);
            // background update
            this.updateBackgroundColor();
        })
    }

    protected movePointer({ x, y, height, width }): void {
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

    private updateBackgroundColor(): void {
        let backgroundColor = null;
        if (this.color()) {
            const currentColor = this.color().getHsva();
            backgroundColor = new Color().setHsva(currentColor.hue, 100, 100).toRgbString();
        }
        this.renderer.setStyle(this.elementRef.nativeElement, 'backgroundColor', backgroundColor);
    }

    private changePointerPosition(x: number, y: number): void {
        this.renderer.setStyle(this.pointer.nativeElement, 'top', `${100 - y}%`);
        this.renderer.setStyle(this.pointer.nativeElement, 'left', `${x}%`);
    }
}
