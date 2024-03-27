import {
    Component,
    ChangeDetectionStrategy,
    ElementRef,
    ViewChild,
    Renderer2,
    booleanAttribute,
    input,
    output,
    InputSignal,
    OutputEmitterRef,
    effect
} from '@angular/core';
import { Color } from './../../../helpers/color.class';
import { BaseComponent } from './../base.component';

@Component({
    selector: `alpha-component`,
    templateUrl: `./alpha.component.html`,
    styleUrls: [
        `./../base.style.scss`,
        `./alpha.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class AlphaComponent extends BaseComponent {

    public color: InputSignal<Color> = input.required<Color>();

    public colorChange: OutputEmitterRef<Color> = output<Color>();

    public isVertical: InputSignal<boolean> = input<boolean, boolean>(false, { alias: 'vertical', transform: booleanAttribute });

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
            this.changePointerPosition(hsva.alpha);
        })
    }

    protected movePointer({ x, y, height, width }): void {
        const alpha = this.isVertical() ? y / height : x / width;
        this.changePointerPosition(alpha);

        const hsva = this.color().getHsva();
        const newColor = new Color().setHsva(hsva.hue, hsva.saturation, hsva.value, alpha);
        this.colorChange.emit(newColor);
    }

    /**
     * hue value is in range from 0 to 360°
     */
    private changePointerPosition(alpha: number): void {
        const x = alpha * 100;
        const orientation = this.isVertical() ? 'top' : 'left';
        this.renderer.setStyle(this.pointer.nativeElement, orientation, `${x}%`);
    }

    public get gradient(): string {
        const rgba = this.color().getRgba();
        const orientation = this.isVertical() ? 'bottom' : 'right';
        return `linear-gradient(to ${orientation}, rgba(${rgba.red}, ${rgba.green}, ${rgba.blue}, 0) 0%, rgb(${rgba.red}, ${rgba.green}, ${rgba.blue}) 100%)`;
    }

}