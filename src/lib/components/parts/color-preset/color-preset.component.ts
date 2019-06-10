import {
    Component,
    HostBinding,
    Input,
    EventEmitter,
    Output,
    ChangeDetectionStrategy,
    HostListener,
    OnDestroy
} from '@angular/core';
import { Color, ColorString } from './../../../helpers/color.class';
import { Subject, of } from 'rxjs';
import { takeUntil, delay, map } from 'rxjs/operators';
import { ColorPickerConfig } from './../../../services/color-picker.service';

@Component({
    selector: `color-preset`,
    template: ``,
    styleUrls: [
        `./../base.style.scss`,
        `./color-preset.component.scss`
    ],
    changeDetection: ChangeDetectionStrategy.OnPush
})
export class ColorPresetComponent implements OnDestroy {

    @Input()
    public activeColor: Color;

    @Input()
    public color: Color;

    @Input('show-depth-title')
    public set depth(showDepthText: boolean) {
        this.showDepthText = !!showDepthText;
    }

    @Output()
    public selectionChange = new EventEmitter<Color>(false);

    @Output()
    public longPress = new EventEmitter<boolean>(false);

    private mouseup = new Subject<MouseEvent | TouchEvent>();

    private showDepthText: boolean = false;

    constructor(private readonly pickerConfig: ColorPickerConfig){}

    public ngOnDestroy(): void {
        this.mouseup.next();
        this.mouseup.complete();
    }

    @HostBinding('style.backgroundColor')
    public get bgColor(): ColorString {
        return this.color.toRgbaString();
    }

    @HostBinding('attr.title')
    public get title() {
        const color = this.color ? this.color.toHexString() : '';

        if (this.showDepthText) {
            return this.pickerConfig.presetsTitle.replace(/\{\s*(.+?)\s*\}/g, (match, firstMatch) => color);
        }
        return color;
    }

    @HostBinding('class.selected')
    public get className(): boolean {
        return this.activeColor ? this.color.toRgbaString() === this.activeColor.toRgbaString() : false;
    }

    @HostListener('mousedown', ['$event'])
    @HostListener('touchstart', ['$event'])
    public onTouch(event: MouseEvent | TouchEvent): void {
        of(event)
            .pipe(
                map((e: MouseEvent | TouchEvent) => e.timeStamp || new Date().getTime()),
                delay(350),
                takeUntil(this.mouseup)
            )
            .subscribe(() => this.longPress.next(true));

        this.selectionChange.emit(this.color);
    }

    @HostListener('mouseup', ['$event'])
    @HostListener('touchend', ['$event'])
    public onTouchEnd(event: MouseEvent | TouchEvent): void {
        this.mouseup.next(event);
    }

}
