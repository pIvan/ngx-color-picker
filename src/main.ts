import { enableProdMode } from '@angular/core';
import { bootstrapApplication } from '@angular/platform-browser';

import { AppComponent } from './app/app.component';
import { environment } from './environments/environment';
import { provideAnimations } from '@angular/platform-browser/animations';

if (environment.production) {
  enableProdMode();
}


bootstrapApplication(AppComponent, {
  providers: [
    provideAnimations(),
    // { provide: COLOR_PICKER_CONFIG, useValue: { indicatorTitle: 'test indikator' } }
  ]
})
.catch(err => console.log(err));