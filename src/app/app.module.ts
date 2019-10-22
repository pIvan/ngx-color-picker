import { NgModule } from '@angular/core';
import { BrowserModule } from '@angular/platform-browser';
import { BrowserAnimationsModule } from '@angular/platform-browser/animations';
import { ColorPickerModule } from '@iplab/ngx-color-picker';
import { AppComponent } from './app.component';

/**
 * wrapper component examples
 */
import { WrapperExampleModule } from './wrap-examples/wrap-example.module';



@NgModule({
  declarations: [
    AppComponent
  ],
  imports: [
    BrowserModule,
    ColorPickerModule,
    BrowserAnimationsModule,
    WrapperExampleModule
  ],
  providers: [],
  bootstrap: [AppComponent]
})
export class AppModule { }
