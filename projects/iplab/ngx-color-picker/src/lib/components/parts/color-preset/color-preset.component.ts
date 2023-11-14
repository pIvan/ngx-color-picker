import {
    Component,
    HostBinding,
    Input,
    EventEmitter,
    Output,
    ChangeDetectionStrategy,
    OnDestroy,
    ElementRef,
    booleanAttribute
} from '@angular/core';
import { Color, ColorString } from './../../../helpers/color.class';
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

    @Input()
    public activeColor: Color;

    @Input()
    public color: Color;

    @Input({ alias: 'show-depth-title', transform: booleanAttribute })
    public showDepthText: boolean = false;

    @Output()
    public selectionChange = new EventEmitter<Color>(false);

    @Output()
    public longPress = new EventEmitter<boolean>(false);

    private mouseup = new Subject<void>();

    private subscriptions: Subscription[] = [];

    constructor(private readonly pickerConfig: ColorPickerConfig, private readonly elementRef: ElementRef) {
        this.addEventListeners();
    }

    public ngOnDestroy(): void {
        this.mouseup.next();
        this.mouseup.complete();
        this.removeEventListeners();
    }

    @HostBinding('style.backgroundColor')
    public get bgColor(): ColorString {
        return this.color.toRgbaString();
    }

    @HostBinding('attr.title')
    public get title() {
        const color = this.color ? this.color.toHexString() : '';

        if (this.showDepthText) {
            return this.pickerConfig.presetsTitle.replace(/\{\s*(.+?)\s*\}/g, (match, firstMatch) => color);
        }
        return color;
    }

    @HostBinding('class.selected')
    public get className(): boolean {
        return this.activeColor ? this.color.toRgbaString() === this.activeColor.toRgbaString() : false;
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
            .subscribe(() => this.longPress.next(true));

        this.selectionChange.emit(this.color);
    }

    private onTouchEnd(): void {
        this.mouseup.next();
    }

}
