import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from '@iplab/ngx-color-picker';
import { AppComponent } from './app.component';

/**
 * wrapper component examples
 */
import { ChromeWrapperComponent } from './wrap-examples/chrome-picker/chrome-wrapper.component';


@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ColorPickerModule,
    BrowserAnimationsModule,
    ChromeWrapperComponent
  ],
  bootstrap: [AppComponent]
})
export class AppModule { }
