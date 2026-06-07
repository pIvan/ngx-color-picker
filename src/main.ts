import { enableProdMode, provideZonelessChangeDetection } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';

if (environment.production) {
  enableProdMode();
}


bootstrapApplication(AppComponent, {
  providers: [
    provideZonelessChangeDetection()
    // { provide: COLOR_PICKER_CONFIG, useValue: { indicatorTitle: 'test indikator' } }
  ]
})
.catch(err => console.log(err));