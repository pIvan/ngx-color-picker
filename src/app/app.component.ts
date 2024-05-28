import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { ColorPickerControl, ColorPickerModule, ColorsTable } from '@iplab/ngx-color-picker';
import * as prettify from 'google-code-prettify/bin/prettify.min.js';
import { ChromeWrapperComponent } from './wrap-examples/chrome-picker/chrome-wrapper.component';

interface IDescription {
  property: string;
  type: string;
  description: string;
}

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.scss'],
  standalone: true,
  imports: [
    ColorPickerModule,
    ChromeWrapperComponent
  ]
})
export class AppComponent implements AfterViewInit {

  public colorControl = new ColorPickerControl()
                          .setValueFrom('rgba(54, 86, 4, 1)');

  public chromeColorControl = new ColorPickerControl()
                          // .setValueFrom('rgb(24, 86, 4)');
                          // .setValueFrom('hsl(83, 70%, 12%)')
                          .setValueFrom('rgba(54, 86, 4, 1)');

  public readonly chromeControl = new ColorPickerControl()
    .setValueFrom(ColorsTable.aquamarine)
    .hidePresets()
    .hideAlphaChannel();

  public readonly sketchControl = new ColorPickerControl()
    .setValueFrom('#A6771C');

  public readonly compactControl = new ColorPickerControl();

  public githubControl = new ColorPickerControl()
    .setValueFrom('#1273DE');

  public swatchesColor = '#F04A71';

  public wrapperColor = '#F04A71';
    
  public angularCompatibility: { ng: string; lib: string }[] = [
    { ng: '17.x.x', lib: '17.x.x' },
    { ng: '16.x.x', lib: '16.x.x' },
    { ng: '15.x.x', lib: '15.x.x' },
    { ng: '14.x.x', lib: '14.x.x' },
    { ng: '13.x.x', lib: '13.x.x' },
    { ng: '12.x.x', lib: '2.1.0' },
    { ng: '11.x.x', lib: '2.0.4, 2.0.5, 2.0.6' }
  ];

  public readonly COLOR_PICKER_CONTROL_METHODS: IDescription[] = [
    { property: 'setValueFrom', type: 'Function', description: 'Set value from Color, Rgba, Hsla, Hsva or ColorString' },
    { property: 'value', type: 'Getter.value', description: 'get value as a Color object' },
    { property: 'reset', type: 'Function', description: 'reset value to initial state' },
    { property: 'valueChanges', type: 'Observable', description: 'Used to observe component value changes' },
    { property: 'isAlphaChannelEnabled', type: 'Function', description: 'return is alpha changel enabled' },
    { property: 'showAlphaChannel', type: 'Function', description: 'show alpha channel' },
    { property: 'hideAlphaChannel', type: 'Function', description: 'hide alpha channel' },
    { property: 'alphaChannelVisibilityChanges', type: 'BehaviorSubject', description: 'Used to observe alpha channel changes' },
    { property: 'setColorPresets', type: 'Function', description: 'define color preset list' },
    { property: 'presets', type: 'Getter.presets', description: 'get color presets' },
    { property: 'hasPresets', type: 'Function', description: 'return status of predefined color presets' },
    { property: 'showPresets', type: 'Function', description: 'show predefined color presets' },
    { property: 'hidePresets', type: 'Function', description: 'hide predefined color presets' },
    { property: 'presetsVisibilityChanges', type: 'BehaviorSubject', description: 'Used to observe color preset visibility' }
  ];

  public readonly COLOR_METHODS: IDescription[] = [
    { property: 'Color.from', type: 'static method', description: 'create new Color object from Color, Rgba, Hsla, Hsva or ColorString' },
    { property: 'clone', type: 'Function', description: 'create new Color object' },
    { property: 'setFromString', type: 'Function', description: 'change the value by providing the string' },
    { property: 'setHsva', type: 'Function', description: 'change the value by providing hsv values' },
    { property: 'setRgba', type: 'Function', description: 'change the value by providing rgb values' },
    { property: 'setHsla', type: 'Function', description: 'change the value by providing hsl values' },
    { property: 'toHexString', type: 'Function', description: 'convert Color object to hex string' },
    { property: 'toRgbString', type: 'Function', description: 'convert Color object to rgb string' },
    { property: 'toRgbaString', type: 'Function', description: 'convert Color object to rgba string' },
    { property: 'toHslString', type: 'Function', description: 'convert Color object to hsl string' },
    { property: 'toHslaString', type: 'Function', description: 'convert Color object to hsla string' },
    { property: 'toHsvString', type: 'Function', description: 'convert Color object to hsv string' },
    { property: 'toHsvaString', type: 'Function', description: 'convert Color object to hsva string' },
    { property: 'toCmykString', type: 'Function', description: 'convert Color object to cmyk string' },
    { property: 'getHsva', type: 'Function', description: 'return Hsva object' },
    { property: 'getRgba', type: 'Function', description: 'return Rgba object' },
    { property: 'getHsla', type: 'Function', description: 'return Hsla object' },
    { property: 'getCmyk', type: 'Function', description: 'return Cmyk object' },
    { property: 'equal', type: 'Function', description: 'compare the values of 2 Color objects' }
  ]

  constructor(private readonly elRef: ElementRef) {
    this.chromeColorControl.valueChanges.subscribe((value) => this.colorControl.setValueFrom(value));
    this.colorControl.valueChanges.subscribe((value) => this.chromeColorControl.setValueFrom(value));
  }

  public ngAfterViewInit(): void {
    this.elRef.nativeElement.querySelectorAll('.prettify')
      .forEach((el: HTMLElement) => el.innerHTML = prettify.prettyPrintOne(el.innerHTML));
  }
}
