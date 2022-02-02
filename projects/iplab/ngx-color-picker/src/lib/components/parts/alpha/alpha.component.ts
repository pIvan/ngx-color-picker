import {
    Component,
    Input,
    EventEmitter,
    Output,
    ChangeDetectionStrategy,
    OnChanges,
    Inject,
    ElementRef,
    ViewChild,
    HostListener,
    Renderer2,
    SimpleChanges
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
import { Color } from './../../../helpers/color.class';
import { BaseComponent } from './../base.component';

@Component({
    selector: `alpha-component`,
    templateUrl: `./alpha.component.html`,
    styleUrls: [
        `./../base.style.scss`,
        `./alpha.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class AlphaComponent extends BaseComponent implements OnChanges {

    @Input()
    public color: Color;

    @Output()
    public colorChange = new EventEmitter<Color>(false);

    @ViewChild('pointer')
    public pointer: ElementRef;

    private isVertical: boolean = false;

    constructor(renderer: Renderer2, @Inject(DOCUMENT) document, elementRef: ElementRef) {
        super(document, elementRef, renderer);
    }

    @HostListener('mousedown', ['$event'])
    @HostListener('touchstart', ['$event'])
    public onClick(event: any): void {
        this.onEventChange(event);
    }

    @Input()
    public set vertical(value: string) {
        this.isVertical = true;
    }

    /**
     * color can be changed through inputs
     * and then we need to move pointer
     */
    public ngOnChanges(changes: SimpleChanges): void {
        if (changes.color && changes.color.previousValue !== changes.color.currentValue) {
            const hsva = this.color.getHsva();
            this.changePointerPosition(hsva.alpha);
        }
    }

    public movePointer({ x, y, height, width }): void {
        const alpha = this.isVertical ? y / height : x / width;
        this.changePointerPosition(alpha);

        const hsva = this.color.getHsva();
        const newColor = new Color().setHsva(hsva.hue, hsva.saturation, hsva.value, alpha);
        this.colorChange.emit(newColor);
    }

    /**
     * hue value is in range from 0 to 360°
     */
    private changePointerPosition(alpha: number): void {
        const x = alpha * 100;
        const orientation = this.isVertical ? 'top' : 'left';
        this.renderer.setStyle(this.pointer.nativeElement, orientation, `${x}%`);
    }

    public get gradient(): string {
        const rgba = this.color.getRgba();
        const orientation = this.isVertical ? 'bottom' : 'right';
        return `linear-gradient(to ${orientation}, rgba(${rgba.red}, ${rgba.green}, ${rgba.blue}, 0) 0%, rgb(${rgba.red}, ${rgba.green}, ${rgba.blue}) 100%)`;
    }

}