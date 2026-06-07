import {
  Component,
  ChangeDetectionStrategy,
  Inject,
  OnDestroy,
  HostBinding,
  InputSignal,
  input,
  OutputEmitterRef,
  output,
  DOCUMENT,
  signal,
  WritableSignal
} from '@angular/core';

import { Color } from './../../../helpers/color.class';
import { fromEvent, merge, Subscription } from 'rxjs';
import { ColorPresetComponent } from './../color-preset/color-preset.component';
// import { ReversePipe } from './../../../pipes/reverse.pipe';

@Component({
    selector: `color-preset-sublist`,
    templateUrl: `./color-preset-sublist.component.html`,
    styleUrls: [
        `./../base.style.scss`,
        `./color-preset-sublist.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
    imports: [ColorPresetComponent],
})
export class ColorPresetSublist implements OnDestroy {

    public list: InputSignal<Array<Color>> = input.required<Array<Color>>();

    public activeColor: InputSignal<Color> = input.required<Color>();

    public direction: InputSignal<'down' | 'up' | 'left' | 'right'> = input<'down' | 'up' | 'left' | 'right'>('up');

    public selectionChange: OutputEmitterRef<Color> = output<Color>();

    public showChildren: WritableSignal<boolean> = signal(false);

    private subscriptions: Subscription[] = [];

    constructor(
        @Inject(DOCUMENT) private readonly document: Document) {
    }

    public ngOnDestroy(): void {
        this.removeListeners();
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
        this.showChildren.set(true)
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
            this.showChildren.set(false);
            this.removeListeners();
        }
    }
}