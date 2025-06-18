
import { ElementRef, OnDestroy, Directive, inject, DOCUMENT } from '@angular/core';
import { fromEvent, merge, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive()
export abstract class BaseComponent implements OnDestroy {

    private readonly subscriptions: Subscription[] = [];
    private window: any = { pageXOffset: 0, pageYOffset: 0 };
    private readonly requestAnimationFrame;

    private mouseup = new Subject<void>();

    private readonly document = inject(DOCUMENT);

    protected readonly elementRef: ElementRef = inject(ElementRef);

    constructor() {
        this.window = document.defaultView;
        this.requestAnimationFrame = this.getRequestAnimationFrame();
        this.addEventListeners();
    }

    protected abstract movePointer(coordinates: { x: number; y: number; height: number; width: number; }): void;

    private addEventListeners(): void {
        this.subscriptions.push(
            merge(
                fromEvent(this.elementRef.nativeElement, 'touchstart', { passive: true, capture: true }),
                fromEvent(this.elementRef.nativeElement, 'mousedown', { capture: true })
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
            fromEvent(this.document, 'mousemove', { capture: true }),
            fromEvent(this.document, 'touchmove', { passive: true, capture: true })
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

    private getRequestAnimationFrame(): () => void {
        return this.window.requestAnimationFrame ||
            this.window.webkitRequestAnimationFrame ||
            this.window.mozRequestAnimationFrame ||
            this.window.oRequestAnimationFrame ||
            this.window.msRequestAnimationFrame;
    }

    public ngOnDestroy(): void {
        this.mouseup.next();
        this.mouseup.complete();
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }
}
