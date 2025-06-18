import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy,
  ChangeDetectorRef,
  HostBinding,
  InputSignal,
  input,
  OutputEmitterRef,
  output,
  DOCUMENT
} from '@angular/core';

import { Color } from './../../../helpers/color.class';
import { OpacityAnimation, ListAnimation } from './color-preset-sublist.animation';
import { fromEvent, merge, Subscription } from 'rxjs';
import { ColorPresetComponent } from './../color-preset/color-preset.component';
import { ReversePipe } from './../../../pipes/reverse.pipe';

@Component({
    selector: `color-preset-sublist`,
    templateUrl: `./color-preset-sublist.component.html`,
    styleUrls: [
        `./../base.style.scss`,
        `./color-preset-sublist.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ColorPresetComponent, ReversePipe],
    animations: [OpacityAnimation, ListAnimation]
})
export class ColorPresetSublist implements OnDestroy {

    public list: InputSignal<Array<Color>> = input.required<Array<Color>>();

    public activeColor: InputSignal<Color> = input.required<Color>();

    public direction: InputSignal<'down' | 'up' | 'left' | 'right'> = input<'down' | 'up' | 'left' | 'right'>('up');

    public selectionChange: OutputEmitterRef<Color> = output<Color>();

    public showChildren: boolean = false;

    private subscriptions: Subscription[] = [];

    constructor(
        @Inject(DOCUMENT) private readonly document,
        private readonly cdr: ChangeDetectorRef) {
    }

    public ngOnDestroy(): void {
        this.removeListeners();
        this.cdr.detach();
    }

    @HostBinding('className')
    public get className(): string {
        return `direction-${this.direction()}`;
    }

    /**
     * emit color change
     */
    public onSelectionChange(color: Color): void {
        this.selectionChange.emit(color);
    }

    public onLongPress(): void {
        this.showChildren = true;
        this.listenDocumentEvents();
    }

    private removeListeners(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }

    private listenDocumentEvents(): void {
        this.subscriptions.push(
            merge(
                fromEvent(this.document, 'mousedown'),
                fromEvent(this.document, 'touchstart', { passive: true })
            )
            .subscribe(() => this.closeList())
        );
    }

    private closeList(): void {
        if (this.showChildren) {
            this.showChildren = false;
            this.cdr.markForCheck();
            this.removeListeners();
        }
    }
}