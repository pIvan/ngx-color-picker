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
  WritableSignal,
  computed,
  NgZone,
  inject
} from '@angular/core';

import { Color } from './../../../helpers/color.class';
import { fromEvent, merge, Subscription } from 'rxjs';
import { ColorPresetComponent } from './../color-preset/color-preset.component';

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

    public activeColor: InputSignal<Color | undefined> = input<Color>();

    public activeColorKey: InputSignal<string | null> = input<string | null>(null);

    public direction: InputSignal<'down' | 'up' | 'left' | 'right'> = input<'down' | 'up' | 'left' | 'right'>('up');

    public selectionChange: OutputEmitterRef<Color> = output<Color>();

    public showChildren: WritableSignal<boolean> = signal(false);

    protected readonly firstColorStyle = computed(() => this.list()[0]?.toRgbaString() ?? '');

    protected readonly resolvedActiveColorKey = computed(() => {
        const key = this.activeColorKey();
        return key !== null ? key : (this.activeColor()?.toRgbaString() ?? '');
    });

    private readonly ngZone = inject(NgZone);
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
        this.showChildren.set(true);
        this.listenDocumentEvents();
    }

    private removeListeners(): void {
        this.subscriptions.forEach((subscription) => subscription.unsubscribe());
        this.subscriptions.length = 0;
    }

    private listenDocumentEvents(): void {
        this.ngZone.runOutsideAngular(() => {
            this.subscriptions.push(
                merge(
                    fromEvent(this.document, 'mousedown'),
                    fromEvent(this.document, 'touchstart', { passive: true })
                )
                .subscribe(() => this.ngZone.run(() => this.closeList()))
            );
        });
    }

    private closeList(): void {
        if (this.showChildren()) {
            this.showChildren.set(false);
            this.removeListeners();
        }
    }
}
