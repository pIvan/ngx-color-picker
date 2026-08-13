
import { ElementRef, OnDestroy, Directive, inject, DOCUMENT } from '@angular/core';
import { fromEvent, merge, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive()
export abstract class BaseComponent implements OnDestroy {

    private readonly subscriptions: Subscription[] = [];
    private window: (Window & typeof globalThis);
    private readonly requestAnimationFrame: (callback: FrameRequestCallback) => number;

    private mouseup = new Subject<void>();

    private readonly document = inject(DOCUMENT);

    protected readonly elementRef: ElementRef = inject(ElementRef);

    constructor() {
        this.window = this.document.defaultView as (Window & typeof globalThis);
        this.requestAnimationFrame = this.getRequestAnimationFrame();
        this.addEventListeners();
    }

    protected abstract movePointer(coordinates: { x: number; y: number; height: number; width: number; }): void;

    private addEventListeners(): void {
        this.subscriptions.push(
            merge(
                fromEvent<TouchEvent>(this.elementRef.nativeElement, 'touchstart', { passive: true, capture: true }),
                fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousedown', { capture: true })
            )
            .subscribe((e: TouchEvent | MouseEvent) => this.onEventChange(e))
        );
    }

    private onEventChange(event: MouseEvent | TouchEvent): void {
        this.calculate(event);

        merge(
            fromEvent(this.document, 'mouseup', { capture: true }),
            fromEvent(this.document, 'touchend', { capture: true })
        )
        .pipe(takeUntil(this.mouseup))
        .subscribe(() => this.mouseup.next());

        merge(
            fromEvent<MouseEvent>(this.document, 'mousemove', { capture: true }),
            fromEvent<TouchEvent>(this.document, 'touchmove', { passive: true, capture: true })
        )
        .pipe(takeUntil(this.mouseup))
        .subscribe((e: MouseEvent | TouchEvent) => this.calculate(e));
    }

    private calculateCoordinates(event: MouseEvent | TouchEvent): void {
        const { width: elWidth, height: elHeight, top: elTop, left: elLeft } = this.elementRef.nativeElement.getBoundingClientRect();

        const pageX = typeof (event as MouseEvent).pageX === 'number'
                        ? (event as MouseEvent).pageX : (event as TouchEvent).touches[0].pageX;
        const pageY = typeof  (event as MouseEvent).pageY === 'number'
                        ? (event as MouseEvent).pageY : (event as TouchEvent).touches[0].pageY;

        const x = Math.max(0, Math.min(pageX - (elLeft + this.window.pageXOffset), elWidth));
        const y = Math.max(0, Math.min(pageY - (elTop + this.window.pageYOffset), elHeight));

        this.movePointer({ x, y, height: elHeight, width: elWidth });
    }

    private calculate(event: MouseEvent | TouchEvent): void {
        event.stopPropagation();
        if (!event.type.includes('touch')) {
            event.preventDefault();
        }
        if (!this.requestAnimationFrame) {
            return this.calculateCoordinates(event);
        }

        this.requestAnimationFrame.call(this.window, () => this.calculateCoordinates(event));
    }

    private getRequestAnimationFrame(): (callback: FrameRequestCallback) => number {
        const windowWithLegacyAnimationFrame = this.window as Window & {
            webkitRequestAnimationFrame?: typeof window.requestAnimationFrame;
            mozRequestAnimationFrame?: typeof window.requestAnimationFrame;
            oRequestAnimationFrame?: typeof window.requestAnimationFrame;
            msRequestAnimationFrame?: typeof window.requestAnimationFrame;
        };

        return windowWithLegacyAnimationFrame.requestAnimationFrame ||
            windowWithLegacyAnimationFrame.webkitRequestAnimationFrame ||
            windowWithLegacyAnimationFrame.mozRequestAnimationFrame ||
            windowWithLegacyAnimationFrame.oRequestAnimationFrame ||
            windowWithLegacyAnimationFrame.msRequestAnimationFrame;
    }

    public ngOnDestroy(): void {
        this.mouseup.next();
        this.mouseup.complete();
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }
}
