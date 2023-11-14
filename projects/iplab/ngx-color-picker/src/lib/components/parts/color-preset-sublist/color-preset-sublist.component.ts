import {
    Component,
    Input,
    ChangeDetectionStrategy,
    Inject,
    OnDestroy,
    ChangeDetectorRef,
    Output,
    EventEmitter,
    HostBinding
} from '@angular/core';
import { DOCUMENT } from '@angular/common';
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
    standalone: true,
    imports: [ColorPresetComponent, ReversePipe],
    animations: [OpacityAnimation, ListAnimation]
})
export class ColorPresetSublist implements OnDestroy {

    @Input()
    public list: Array<Color>;

    @Output()
    public selectionChange = new EventEmitter<Color>(false);

    @Input()
    public direction: 'down' | 'up' | 'left' | 'right' = 'up';

    @Input()
    public activeColor: Color;

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
        return `direction-${this.direction}`;
    }

    /**
     * emit color change
     */
    public onSelectionChange(color: Color): void {
        this.selectionChange.next(color);
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