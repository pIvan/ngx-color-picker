import {
    Component,
    HostBinding,
    ChangeDetectionStrategy,
    OnDestroy,
    ElementRef,
    booleanAttribute,
    input,
    InputSignal,
    effect,
    Renderer2,
    output,
    OutputEmitterRef
} from '@angular/core';
import { Color } from './../../../helpers/color.class';
import { Subject, of, fromEvent, Subscription, merge } from 'rxjs';
import { takeUntil, delay, map } from 'rxjs/operators';
import { ColorPickerConfig } from './../../../services/color-picker.service';

@Component({
    selector: `color-preset`,
    template: ``,
    styleUrls: [
        `./../base.style.scss`,
        `./color-preset.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true
})
export class ColorPresetComponent implements OnDestroy {

    public activeColor: InputSignal<Color> = input.required<Color>();

    public color: InputSignal<Color> = input.required<Color>();

    public showDepthText: InputSignal<boolean> = input<boolean, boolean>(false, { alias: 'show-depth-title', transform: booleanAttribute });

    public selectionChange: OutputEmitterRef<Color> = output<Color>();

    public longPress: OutputEmitterRef<boolean> = output<boolean>();

    private mouseup = new Subject<void>();

    private subscriptions: Subscription[] = [];

    constructor(
        private readonly pickerConfig: ColorPickerConfig,
        private readonly elementRef: ElementRef,
        private readonly renderer: Renderer2) {
        this.addEventListeners();

        effect(() => {
            this.updateBackground();
            this.updateTitleAttr();
        })
    }

    public ngOnDestroy(): void {
        this.mouseup.next();
        this.mouseup.complete();
        this.removeEventListeners();
    }

    @HostBinding('class.selected')
    public get className(): boolean {
        return this.activeColor() ? this.color().toRgbaString() === this.activeColor().toRgbaString() : false;
    }

    private updateBackground(): void {
        this.renderer.setStyle(this.elementRef.nativeElement, 'backgroundColor', this.color().toRgbaString());
    }

    private updateTitleAttr(): void {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'title', this.getTitle());
    }

    private getTitle() {
        const color = this.color() ? this.color().toHexString() : '';

        if (this.showDepthText()) {
            return (this.pickerConfig?.presetsTitle || '').replace(/\{\s*(.+?)\s*\}/g, (match, firstMatch) => color);
        }
        return color;
    }

    private addEventListeners(): void {
        this.subscriptions.push(
            merge(
                fromEvent(this.elementRef.nativeElement, 'mouseup'),
                fromEvent(this.elementRef.nativeElement, 'touchend')
            )
            .subscribe(() => this.onTouchEnd())
        );

        this.subscriptions.push(
            merge(
                fromEvent(this.elementRef.nativeElement, 'mousedown'),
                fromEvent(this.elementRef.nativeElement, 'touchstart', { passive: true })
            )
            .subscribe((e: MouseEvent | TouchEvent) => this.onTouch(e))
        );
    }

    private removeEventListeners(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }

    private onTouch(event: MouseEvent | TouchEvent): void {
        of(event)
            .pipe(
                map((e: MouseEvent | TouchEvent) => e.timeStamp || new Date().getTime()),
                delay(350),
                takeUntil(this.mouseup)
            )
            .subscribe(() => this.longPress.emit(true));

        this.selectionChange.emit(this.color());
    }

    private onTouchEnd(): void {
        this.mouseup.next();
    }

}
