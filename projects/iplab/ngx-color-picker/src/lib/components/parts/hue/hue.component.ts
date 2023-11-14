import {
    Component,
    ChangeDetectionStrategy,
    Input,
    Renderer2,
    ElementRef,
    Output,
    EventEmitter,
    ViewChild,
    SimpleChanges,
    OnChanges,
    booleanAttribute
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
export class HueComponent extends BaseComponent implements OnChanges {

    @Input()
    public color: Color;

    @Output()
    public colorChange = new EventEmitter<Color>(false);

    @ViewChild('pointer', { static: true })
    public pointer: ElementRef;

    @Input({ alias: 'vertical', transform: booleanAttribute })
    private isVertical: boolean = false;

    constructor(private readonly renderer: Renderer2) {
        super();
    }

    /**
     * color can be changed through inputs
     * and then we need to move pointer
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.color && changes.color.previousValue !== changes.color.currentValue) {
            const hsva = this.color.getHsva();
            this.changePointerPosition(hsva.hue);
        }
    }

    protected movePointer({ x, y, height, width }): void {
        const hue = this.isVertical ? (y / height) * 360 : (x / width) * 360;
        this.changePointerPosition(hue);

        const currentColor = this.color.getHsva();
        const newHueColor = new Color().setHsva(hue, currentColor.saturation, currentColor.value, currentColor.alpha);
        this.colorChange.emit(newHueColor);
    }

    /**
     * hue value is in range from 0 to 360°
     */
    private changePointerPosition(hue: number): void {
        const x = (hue / 360) * 100;
        const orientation = this.isVertical ? 'top' : 'left';
        this.renderer.setStyle(this.pointer.nativeElement, orientation, `${x}%`);
    }
}