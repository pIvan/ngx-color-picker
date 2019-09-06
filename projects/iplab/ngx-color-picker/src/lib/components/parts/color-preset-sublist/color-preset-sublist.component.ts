import {
    Component,
    Input,
    ChangeDetectionStrategy,
    Renderer2,
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

@Component({
    selector: `color-preset-sublist`,
    templateUrl: `./color-preset-sublist.component.html`,
    styleUrls: [
        `./../base.style.scss`,
        `./color-preset-sublist.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush,
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

    private hooks: Array<Function> = [];

    constructor(
        private readonly renderer: Renderer2,
        @Inject(DOCUMENT) private readonly document,
        private readonly cdr: ChangeDetectorRef) {
    }

    public ngOnDestroy(): void {
        this.removeListeners();
        this.cdr.detach();
    }

    private removeListeners(): void {
        this.hooks.forEach((callback) => callback());
        this.hooks.length = 0;
    }

    /**
     * emit color change
     */
    public onSelectionChange(color: Color): void {
        this.selectionChange.next(color);
    }

    public onLongPress(): void {
        this.showChildren = true;
        this.listenDocumentClick();
    }

    private listenDocumentClick(): void {
        this.hooks.push(this.renderer.listen(this.document, 'mousedown', () => this.closeList()));
        this.hooks.push(this.renderer.listen(this.document, 'touchstart', () => this.closeList()));
    }

    private closeList(): void {
        if (this.showChildren) {
            this.showChildren = false;
            this.cdr.markForCheck();
            this.removeListeners();
        }
    }

    @HostBinding('className')
    public get className(): string {
        return `direction-${this.direction}`;
    }
}