/*
 * ngx-color-picker
 *
 * By Ivan Pintar, http://www.pintar-ivan.com
 * Licensed under the MIT License
 * See https://github.com/pIvan/ngx-color-picker/blob/master/README.md
 */
import { NgModule, ModuleWithProviders } from '@angular/core';
import { CommonModule } from '@angular/common';

/**
 * parts
 */
import { SaturationComponent } from './components/parts/saturation/saturation.component';
import { IndicatorComponent } from './components/parts/indicator/indicator.component';
import { HueComponent } from './components/parts/hue/hue.component';
import { AlphaComponent } from './components/parts/alpha/alpha.component';
import { RgbaComponent } from './components/parts/inputs/rgba-input/rgba-input.component';
import { HslaComponent } from './components/parts/inputs/hsla-input/hsla-input.component';
import { HexComponent } from './components/parts/inputs/hex-input/hex-input.component';
import { ColorPresetsComponent } from './components/parts/color-presets/color-presets.component';
import { ColorPresetComponent } from './components/parts/color-preset/color-preset.component';
import { ColorPresetSublist } from './components/parts/color-preset-sublist/color-preset-sublist.component';

export { SaturationComponent } from './components/parts/saturation/saturation.component';
export { IndicatorComponent } from './components/parts/indicator/indicator.component';
export { HueComponent } from './components/parts/hue/hue.component';
export { AlphaComponent } from './components/parts/alpha/alpha.component';
export { RgbaComponent } from './components/parts/inputs/rgba-input/rgba-input.component';
export { HslaComponent } from './components/parts/inputs/hsla-input/hsla-input.component';
export { HexComponent } from './components/parts/inputs/hex-input/hex-input.component';
export { ColorPresetsComponent } from './components/parts/color-presets/color-presets.component';
export { ColorPresetComponent } from './components/parts/color-preset/color-preset.component';
export { ColorPresetSublist } from './components/parts/color-preset-sublist/color-preset-sublist.component';
/**
 * directives
 */
import { ColorPickerInputDirective } from './directives/color-picker-input.directive';

/**
 * pipes
 */
import { ChunksPipe } from './pipes/chunks.pipe';
import { ReversePipe } from './pipes/reverse.pipe';

/**
 * pickers
 */
import { ChromePickerComponent } from './components/chrome-picker/chrome-picker.component';
import { SketchPickerComponent } from './components/sketch-picker/sketch-picker.component';
import { CompactPickerComponent } from './components/compact-picker/compact-picker.component';
import { GithubPickerComponent } from './components/github-picker/github-picker.component';
import { SwatchesPickerComponent } from './components/swatches-picker/swatches-picker.component';
import { IpPickerComponent } from './components/ip-picker/ip-picker.component';

export { ChromePickerComponent } from './components/chrome-picker/chrome-picker.component';
export { SketchPickerComponent } from './components/sketch-picker/sketch-picker.component';
export { CompactPickerComponent } from './components/compact-picker/compact-picker.component';
export { GithubPickerComponent } from './components/github-picker/github-picker.component';
export { SwatchesPickerComponent } from './components/swatches-picker/swatches-picker.component';
export { IpPickerComponent } from './components/ip-picker/ip-picker.component';

/**
 * services
 */
import { COLOR_PICKER_CONFIG, ColorPickerConfig, IColorPickerConfig } from './services/color-picker.service';

/**
 * exports
 */
export { Color } from './helpers/color.class';
export { ColorPickerControl, ColorType } from './helpers/control.class';
export { ColorsTable } from './helpers/colors-table.class';
export { getValueByType } from './helpers/helper.functions';
export { IColorPickerConfig, COLOR_PICKER_CONFIG, ColorPickerConfig } from './services/color-picker.service';

@NgModule({
    imports: [
        CommonModule,
        SaturationComponent,
        IndicatorComponent,
        HueComponent,
        AlphaComponent,

        RgbaComponent,
        HslaComponent,
        HexComponent,

        ColorPresetsComponent,
        ColorPresetComponent,
        ColorPresetSublist,

        ColorPickerInputDirective,
        ChunksPipe,
        ReversePipe,
        /**
         * prepared components
         */
        ChromePickerComponent,
        SketchPickerComponent,
        SwatchesPickerComponent,
        GithubPickerComponent,
        CompactPickerComponent,
        IpPickerComponent
    ],
    exports: [
        SaturationComponent,
        IndicatorComponent,
        HueComponent,
        AlphaComponent,

        RgbaComponent,
        HslaComponent,
        HexComponent,

        ColorPresetsComponent,

        ChromePickerComponent,
        SketchPickerComponent,
        SwatchesPickerComponent,
        GithubPickerComponent,
        CompactPickerComponent,
        IpPickerComponent
    ]
})
export class ColorPickerModule {

    public static forRoot<T extends IColorPickerConfig>(configuration?: T): ModuleWithProviders<ColorPickerModule> {
        return {
            ngModule: ColorPickerModule,
            providers: [
                { provide: COLOR_PICKER_CONFIG, useValue: configuration || new ColorPickerConfig() }
            ]
        };
    }
}
