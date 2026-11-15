import { Component, NgZone, provideZoneChangeDetection } from '@angular/core';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { BaseComponent } from './base.component';
import { Color } from '../../helpers/color.class';
import { HexComponent } from './inputs/hex-input/hex-input.component';
import { HueComponent } from './hue/hue.component';

@Component({
    selector: 'test-drag-target',
    template: '',
    standalone: true
})
class TestDragComponent extends BaseComponent {
    public calls: Array<{ x: number; y: number; height: number; width: number; inZone: boolean }> = [];

    protected movePointer(coordinates: { x: number; y: number; height: number; width: number }): void {
        this.calls.push({ ...coordinates, inZone: NgZone.isInAngularZone() });
    }
}

describe('BaseComponent drag handling', () => {
    let fixture: ComponentFixture<TestDragComponent>;
    let component: TestDragComponent;
    let element: HTMLElement;
    let rafCallbacks: FrameRequestCallback[];
    let originalRaf: typeof window.requestAnimationFrame;
    let originalCancelRaf: typeof window.cancelAnimationFrame;

    beforeEach(async () => {
        rafCallbacks = [];
        originalRaf = window.requestAnimationFrame;
        originalCancelRaf = window.cancelAnimationFrame;

        await TestBed.configureTestingModule({
            imports: [TestDragComponent],
            providers: [provideZoneChangeDetection()]
        }).compileComponents();

        fixture = TestBed.createComponent(TestDragComponent);
        component = fixture.componentInstance;
        element = fixture.nativeElement;
        fixture.detectChanges();

        spyOn(window, 'requestAnimationFrame').and.callFake((cb: FrameRequestCallback) => {
            rafCallbacks.push(cb);
            return rafCallbacks.length;
        });
        spyOn(window, 'cancelAnimationFrame').and.callFake((id: number) => {
            if (id > 0 && id <= rafCallbacks.length) {
                rafCallbacks[id - 1] = () => {};
            }
        });
    });

    afterEach(() => {
        window.requestAnimationFrame = originalRaf;
        window.cancelAnimationFrame = originalCancelRaf;
    });

    function flushRaf() {
        const pending = rafCallbacks.splice(0, rafCallbacks.length);
        pending.forEach((cb) => cb(performance.now()));
    }

    it('should coalesce multiple mousemove events within the same animation frame', () => {
        spyOn(element, 'getBoundingClientRect').and.returnValue({
            left: 10,
            top: 20,
            width: 200,
            height: 100,
            right: 210,
            bottom: 120,
            x: 10,
            y: 20,
            toJSON: () => ({})
        } as DOMRect);

        element.dispatchEvent(new MouseEvent('mousedown', { clientX: 20, clientY: 30, bubbles: true }));
        expect(rafCallbacks.length).toBe(1);
        flushRaf();
        expect(component.calls.length).toBe(1);
        expect(component.calls[0]).toEqual({ x: 10, y: 10, width: 200, height: 100, inZone: true });

        // Burst of 5 mousemove events in one frame -> only 1 rAF scheduled, uses last event
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 30, clientY: 40 }));
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 70, clientY: 60 }));
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 90, clientY: 70 }));
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 110, clientY: 80 }));

        expect(rafCallbacks.length).toBe(1);
        flushRaf();

        expect(component.calls.length).toBe(2);
        expect(component.calls[1]).toEqual({ x: 100, y: 60, width: 200, height: 100, inZone: true });

        document.dispatchEvent(new MouseEvent('mouseup'));
    });

    it('should run drag listeners outside NgZone and enter NgZone only in movePointer', () => {
        spyOn(element, 'getBoundingClientRect').and.returnValue({
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            right: 100,
            bottom: 100,
            x: 0,
            y: 0,
            toJSON: () => ({})
        } as DOMRect);

        const listenerZones: boolean[] = [];
        const origPreventDefault = MouseEvent.prototype.preventDefault;
        spyOn(MouseEvent.prototype, 'preventDefault').and.callFake(function (this: MouseEvent) {
            listenerZones.push(NgZone.isInAngularZone());
            return origPreventDefault.call(this);
        });

        element.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 10, cancelable: true }));
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50, cancelable: true }));
        flushRaf();
        document.dispatchEvent(new MouseEvent('mouseup'));

        expect(listenerZones).toEqual([false, false]);
        expect(component.calls.length).toBe(1);
        expect(component.calls[0].inZone).toBeTrue();
    });

    it('should cache getBoundingClientRect during drag and invalidate on scroll/resize', () => {
        const rectSpy = spyOn(element, 'getBoundingClientRect').and.returnValue({
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            right: 100,
            bottom: 100,
            x: 0,
            y: 0,
            toJSON: () => ({})
        } as DOMRect);

        element.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 10 }));
        expect(rectSpy).toHaveBeenCalledTimes(1);

        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 20, clientY: 20 }));
        flushRaf();
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 30, clientY: 30 }));
        flushRaf();
        expect(rectSpy).toHaveBeenCalledTimes(1);

        // Scroll invalidates cache
        document.dispatchEvent(new Event('scroll'));
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 40, clientY: 40 }));
        flushRaf();
        expect(rectSpy).toHaveBeenCalledTimes(2);

        // Resize invalidates cache
        window.dispatchEvent(new Event('resize'));
        document.dispatchEvent(new MouseEvent('mousemove', { clientX: 50, clientY: 50 }));
        flushRaf();
        expect(rectSpy).toHaveBeenCalledTimes(3);

        document.dispatchEvent(new MouseEvent('mouseup'));
    });

    it('should cancel pending rAF on destroy', () => {
        spyOn(element, 'getBoundingClientRect').and.returnValue({
            left: 0,
            top: 0,
            width: 100,
            height: 100,
            right: 100,
            bottom: 100,
            x: 0,
            y: 0,
            toJSON: () => ({})
        } as DOMRect);

        element.dispatchEvent(new MouseEvent('mousedown', { clientX: 10, clientY: 10 }));
        expect(rafCallbacks.length).toBe(1);

        fixture.destroy();
        expect(window.cancelAnimationFrame).toHaveBeenCalledWith(1);
    });
});

describe('HueComponent & HexComponent fixes', () => {
    it('should map HueComponent pointer across 0..359 range', async () => {
        await TestBed.configureTestingModule({
            imports: [HueComponent]
        }).compileComponents();

        const fixture = TestBed.createComponent(HueComponent);
        const component = fixture.componentInstance;
        fixture.componentRef.setInput('color', new Color('#ff0000'));
        fixture.detectChanges();

        (component as any).movePointer({ x: 100, y: 0, width: 200, height: 10 });
        expect(component.color().getHsva().hue).toBe(179.5);

        (component as any).movePointer({ x: 200, y: 0, width: 200, height: 10 });
        expect(component.color().getHsva().hue).toBe(359);
    });

    it('should not emit unchanged color in HexComponent on non-modifying keyup', async () => {
        await TestBed.configureTestingModule({
            imports: [HexComponent]
        }).compileComponents();

        const fixture = TestBed.createComponent(HexComponent);
        const component = fixture.componentInstance;
        const initial = new Color('#ff0000');
        fixture.componentRef.setInput('color', initial);
        fixture.componentRef.setInput('prefix', '#');
        fixture.detectChanges();

        const setSpy = spyOn(component.color, 'set').and.callThrough();
        component.onInputChange(new KeyboardEvent('keyup', { key: 'Shift' }), '#FF0000');
        expect(setSpy).not.toHaveBeenCalled();

        component.onInputChange(new KeyboardEvent('keyup', { key: '0' }), '#00FF00');
        expect(setSpy).toHaveBeenCalledTimes(1);
        expect(component.color().toHexString()).toBe('#00FF00');
    });
});
