import { ElementRef, OnDestroy, Directive, inject, DOCUMENT, NgZone } from '@angular/core';
import { fromEvent, merge, Subject, Subscription } from 'rxjs';
import { takeUntil } from 'rxjs/operators';

@Directive()
export abstract class BaseComponent implements OnDestroy {

    private readonly subscriptions: Subscription[] = [];
    private readonly window: Window & typeof globalThis;
    private readonly document = inject(DOCUMENT);
    private readonly ngZone = inject(NgZone);

    protected readonly elementRef: ElementRef = inject(ElementRef);

    private readonly mouseup = new Subject<void>();
    private pendingEvent: MouseEvent | TouchEvent | null = null;
    private frameId: number | null = null;
    private cachedRect: DOMRect | null = null;
    private isDragging = false;

    constructor() {
        this.window = this.document.defaultView as (Window & typeof globalThis);
        this.addEventListeners();
    }

    protected abstract movePointer(coordinates: { x: number; y: number; height: number; width: number; }): void;

    private addEventListeners(): void {
        this.ngZone.runOutsideAngular(() => {
            this.subscriptions.push(
                merge(
                    fromEvent<TouchEvent>(this.elementRef.nativeElement, 'touchstart', { passive: true, capture: true }),
                    fromEvent<MouseEvent>(this.elementRef.nativeElement, 'mousedown', { capture: true })
                )
                .subscribe((e: TouchEvent | MouseEvent) => this.onEventChange(e))
            );
        });
    }

    private onEventChange(event: MouseEvent | TouchEvent): void {
        if (this.isDragging) {
            this.mouseup.next();
        }
        this.isDragging = true;
        this.cachedRect = this.elementRef.nativeElement.getBoundingClientRect();
        this.calculate(event);

        merge(
            fromEvent(this.document, 'mouseup', { capture: true }),
            fromEvent(this.document, 'touchend', { capture: true })
        )
        .pipe(takeUntil(this.mouseup))
        .subscribe(() => {
            this.isDragging = false;
            this.cachedRect = null;
            this.mouseup.next();
        });

        merge(
            fromEvent<MouseEvent>(this.document, 'mousemove', { capture: true }),
            fromEvent<TouchEvent>(this.document, 'touchmove', { passive: true, capture: true })
        )
        .pipe(takeUntil(this.mouseup))
        .subscribe((e: MouseEvent | TouchEvent) => this.calculate(e));

        merge(
            fromEvent(this.document, 'scroll', { passive: true, capture: true }),
            ...(this.window ? [fromEvent(this.window, 'resize', { passive: true })] : [])
        )
        .pipe(takeUntil(this.mouseup))
        .subscribe(() => {
            this.cachedRect = null;
        });
    }

    private calculateCoordinates(event: MouseEvent | TouchEvent): void {
        const rect = this.cachedRect ?? this.elementRef.nativeElement.getBoundingClientRect();
        if (this.isDragging && !this.cachedRect) {
            this.cachedRect = rect;
        }

        const elWidth = rect.width;
        const elHeight = rect.height;
        if (elWidth <= 0 || elHeight <= 0) {
            return;
        }

        let clientX: number;
        let clientY: number;
        if (typeof (event as MouseEvent).clientX === 'number') {
            clientX = (event as MouseEvent).clientX;
            clientY = (event as MouseEvent).clientY;
        } else {
            const touch = (event as TouchEvent).touches[0] ?? (event as TouchEvent).changedTouches[0];
            if (!touch) {
                return;
            }
            clientX = touch.clientX;
            clientY = touch.clientY;
        }

        const x = Math.max(0, Math.min(clientX - rect.left, elWidth));
        const y = Math.max(0, Math.min(clientY - rect.top, elHeight));

        this.ngZone.run(() => {
            this.movePointer({ x, y, height: elHeight, width: elWidth });
        });
    }

    private calculate(event: MouseEvent | TouchEvent): void {
        event.stopPropagation();
        if (event.cancelable && !event.type.startsWith('touch')) {
            event.preventDefault();
        }

        if (!this.window?.requestAnimationFrame) {
            this.calculateCoordinates(event);
            return;
        }

        this.pendingEvent = event;
        if (this.frameId === null) {
            this.frameId = this.window.requestAnimationFrame(() => {
                this.frameId = null;
                const pending = this.pendingEvent;
                this.pendingEvent = null;
                if (pending) {
                    this.calculateCoordinates(pending);
                }
            });
        }
    }

    public ngOnDestroy(): void {
        this.isDragging = false;
        this.cachedRect = null;
        this.mouseup.next();
        this.mouseup.complete();
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
        if (this.frameId !== null) {
            this.window?.cancelAnimationFrame(this.frameId);
            this.frameId = null;
        }
        this.pendingEvent = null;
    }
}
