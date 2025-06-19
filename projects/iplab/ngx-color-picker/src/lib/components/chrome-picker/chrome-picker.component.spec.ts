import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ChromePickerComponent } from './chrome-picker.component';
import { ColorPickerControl, ColorType } from './../../helpers/control.class';
import { ColorString } from '../../helpers/color.class';

describe('ChromePickerComponent', () => {
    let component: ChromePickerComponent;
    let fixture: ComponentFixture<ChromePickerComponent>;

    beforeEach(async () => {
        await TestBed.configureTestingModule({
            imports: [ ChromePickerComponent ]
        })
        .compileComponents();
    });

    beforeEach(() => {
        fixture = TestBed.createComponent(ChromePickerComponent);
        component = fixture.componentInstance;
        fixture.detectChanges();
    });

    it('should create', () => {
        expect(component).toBeTruthy();
    });

    function setColorAndCheck(input: string, output: string) {
        component.color.set(input);
        fixture.detectChanges();
        expect(component.color()).toBe(output);
    }

    it('should keep HEX type on output when input is hex', () => {
        const COLOR = '#FF0000';
        setColorAndCheck(COLOR, COLOR);
    });

    it('should keep HEXA type on output when input is hexa', () => {
        const COLOR = '#ff000080';
        setColorAndCheck(COLOR, COLOR);
        const COLOR2 = '#ff0000FF';
        setColorAndCheck(COLOR2, COLOR2);
    });

    it('should keep RGB type on output when input is rgb', () => {
        const COLOR = 'rgb(255,0,0)';
        setColorAndCheck(COLOR, COLOR);
    });

    it('should keep RGBA type on output when input is rgba', () => {
        const COLOR = 'rgba(255,0,0,0.5)';
        setColorAndCheck(COLOR, COLOR);
        
        const COLOR2 = 'rgba(255,0,0,1)';
        setColorAndCheck(COLOR2, COLOR2);
    });

    it('should keep type and add alpha channel if alpha is changed (hex -> hexa)', () => {
        const COLOR = '#FF0000';

        const control = component.control();
        control.initType = ColorType.hex;
        control.setValueFrom(COLOR);


        component.color.set(COLOR);
        fixture.detectChanges();

        // Simulate alpha change
        const NEW_COLOR = '#FF000080'; // hexa with alpha
        control.setValueFrom(NEW_COLOR);
        fixture.detectChanges();

        const output = component.color();
        expect(output).toBe(NEW_COLOR);
    });

    // it('should keep type and add alpha channel if alpha is changed (rgb -> rgba)', () => {
    //     const control = new ColorPickerControl();
    //     control.initType = 'rgb';
    //     control.setValueFrom(new ColorString('rgb(255,0,0)'));
    //     component.control.set(control);
    //     component.color.set(new ColorString('rgb(255,0,0)'));
    //     fixture.detectChanges();

    //     // Simulate alpha change
    //     const newColor = new ColorString('rgba(255,0,0,0.5)');
    //     control.value = 'rgba(255,0,0,0.5)';
    //     control.valueChanges.next('rgba(255,0,0,0.5)');
    //     fixture.detectChanges();

    //     const output = component.color();
    //     expect(output.toString('rgba')).toBe('rgba(255,0,0,0.5)');
    // });
});