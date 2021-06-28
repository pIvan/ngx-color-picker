import { AfterViewInit, Component, ElementRef } from '@angular/core';
import { ColorPickerControl, ColorsTable } from '@iplab/ngx-color-picker';
import * as prettify from 'google-code-prettify/bin/prettify.min.js';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent implements AfterViewInit {

  public color = 'rgba(54, 86, 4, 1)';

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

  constructor(private readonly elRef: ElementRef) {
  }

  public ngAfterViewInit(): void {
    this.elRef.nativeElement.querySelectorAll('.prettify')
      .forEach((el: HTMLElement) => el.innerHTML = prettify.prettyPrintOne(el.innerHTML));
  }
}
