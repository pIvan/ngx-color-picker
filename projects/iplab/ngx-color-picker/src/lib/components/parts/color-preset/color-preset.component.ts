import {
    Component,
    ChangeDetectionStrategy,
    OnDestroy,
    ElementRef,
    booleanAttribute,
    input,
    InputSignal,
    effect,
    Renderer2,
    output,
    OutputEmitterRef,
    InputSignalWithTransform,
    computed,
    Signal,
    NgZone,
    inject
} from '@angular/core';
import { Color } from './../../../helpers/color.class';
import { Subject, of, fromEvent, Subscription, merge } from 'rxjs';
import { takeUntil, delay } from 'rxjs/operators';
import { ColorPickerConfig } from './../../../services/color-picker.service';

@Component({
    selector: `color-preset`,
    template: ``,
    styleUrls: [
        `./../base.style.scss`,
        `./color-preset.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    standalone: true,
    host: {
        '[class.selected]': 'className()',
    }
})
export class ColorPresetComponent implements OnDestroy {

    public activeColor: InputSignal<Color | undefined> = input<Color>();

    public activeColorKey: InputSignal<string | null> = input<string | null>(null);

    public color: InputSignal<Color> = input.required<Color>();

    public showDepthText: InputSignalWithTransform<boolean, string | boolean> = input<boolean, string | boolean>(false, { alias: 'show-depth-title', transform: booleanAttribute });

    public selectionChange: OutputEmitterRef<Color> = output<Color>();

    public longPress: OutputEmitterRef<boolean> = output<boolean>();

    private readonly ngZone = inject(NgZone);
    private mouseup = new Subject<void>();
    private subscriptions: Subscription[] = [];

    private readonly colorKey = computed(() => this.color()?.toRgbaString() ?? '');

    protected className: Signal<boolean> = computed(() => {
        const key = this.activeColorKey();
        if (key !== null) {
            return this.colorKey() === key;
        }
        const active = this.activeColor();
        return active ? this.colorKey() === active.toRgbaString() : false;
    });

    constructor(
        private readonly pickerConfig: ColorPickerConfig,
        private readonly elementRef: ElementRef,
        private readonly renderer: Renderer2) {
        this.addEventListeners();

        effect(() => {
            this.updateBackground();
            this.updateTitleAttr();
        });
    }

    public ngOnDestroy(): void {
        this.mouseup.next();
        this.mouseup.complete();
        this.removeEventListeners();
    }

    private updateBackground(): void {
        this.renderer.setStyle(this.elementRef.nativeElement, 'backgroundColor', this.colorKey());
    }

    private updateTitleAttr(): void {
        this.renderer.setAttribute(this.elementRef.nativeElement, 'title', this.getTitle());
    }

    private getTitle(): string {
        const color = this.color() ? this.color().toHexString() : '';

        if (this.showDepthText()) {
            return (this.pickerConfig?.presetsTitle || '').replace(/\{\s*(.+?)\s*\}/g, () => color);
        }
        return color;
    }

    private addEventListeners(): void {
        this.ngZone.runOutsideAngular(() => {
            this.subscriptions.push(
                merge(
                    fromEvent(this.elementRef.nativeElement, 'mouseup'),
                    fromEvent(this.elementRef.nativeElement, 'touchend')
                )
                .subscribe(() => this.onTouchEnd())
            );

            this.subscriptions.push(
                merge(
                    fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousedown'),
                    fromEvent<TouchEvent>(this.elementRef.nativeElement, 'touchstart', { passive: true })
                )
                .subscribe((e: MouseEvent | TouchEvent) => this.onTouch(e))
            );
        });
    }

    private removeEventListeners(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }

    private onTouch(event: MouseEvent | TouchEvent): void {
        of(event)
            .pipe(
                delay(350),
                takeUntil(this.mouseup)
            )
            .subscribe(() => this.ngZone.run(() => this.longPress.emit(true)));

        this.ngZone.run(() => this.selectionChange.emit(this.color()));
    }

    private onTouchEnd(): void {
        this.mouseup.next();
    }

}
