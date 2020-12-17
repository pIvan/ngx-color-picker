import { ElementRef, Renderer2, OnDestroy, Directive } from '@angular/core';

/**
 * because a dynamic directive yet is not implemented,
 * we have a base class which will
 * help us to implement position calculation in our
 * components
 */
@Directive()
export abstract class BaseComponent implements OnDestroy {

    private eventHooks: Array<Function> = [];
    private window: any = { pageXOffset: 0, pageYOffset: 0 };
    private readonly requestAnimationFrame;

    constructor(private readonly document, protected readonly elementRef: ElementRef, protected readonly renderer: Renderer2) {
        this.window = document.defaultView;
        this.requestAnimationFrame = this.getRequestAnimationFrame();
    }

    public abstract movePointer(coordinates: { x: number; y: number; height: number; width: number; }): void;

    protected onEventChange(event: MouseEvent | TouchEvent): void {
        this.calculate(event);

        this.eventHooks.push(
            this.renderer.listen(this.document, 'mouseup', () => this.removeListeners())
        );
        this.eventHooks.push(
            this.renderer.listen(this.document, 'touchend', () => this.removeListeners())
        );
        this.eventHooks.push(
            this.renderer.listen(this.document, 'mousemove', (e) => this.calculate(e))
        );
        this.eventHooks.push(
            this.renderer.listen(this.document, 'touchmove', (e) => this.calculate(e))
        );
    }

    private calculateCoordinates(event: MouseEvent | TouchEvent): void {
        const { width: elWidth, height: elHeight, top: elTop, left: elLeft } = this.elementRef.nativeElement.getBoundingClientRect();

        const pageX = typeof event['pageX'] === 'number' ? event['pageX'] : event['touches'][0].pageX;
        const pageY = typeof event['pageY'] === 'number' ? event['pageY'] : event['touches'][0].pageY;

        const x = Math.max(0, Math.min(pageX - (elLeft + this.window.pageXOffset), elWidth));
        const y = Math.max(0, Math.min(pageY - (elTop + this.window.pageYOffset), elHeight));

        this.movePointer({ x, y, height: elHeight, width: elWidth });
    }

    private calculate(event: MouseEvent | TouchEvent): void {
        event.preventDefault();
        if (!this.requestAnimationFrame) {
            return this.calculateCoordinates(event);
        }

        this.requestAnimationFrame(() => this.calculateCoordinates(event));
    }

    private getRequestAnimationFrame(): Function {
        return this.window.requestAnimationFrame ||
            this.window.webkitRequestAnimationFrame ||
            this.window.mozRequestAnimationFrame ||
            this.window.oRequestAnimationFrame ||
            this.window.msRequestAnimationFrame;
    }

    private removeListeners(): void {
        this.eventHooks.forEach((cb) => cb());
        this.eventHooks.length = 0;
    }

    public ngOnDestroy(): void {
        this.removeListeners();
    }
}