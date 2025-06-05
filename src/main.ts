import {enableProdMode} from '@angular/core';
import {bootstrapApplication} from '@angular/platform-browser';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';

import {HslayersAppComponent} from './app/app.component';
import {environment} from './environments/environment';

if (environment.production) {
  enableProdMode();
}

setTimeout(() => {
  bootstrapApplication(HslayersAppComponent, {
    providers: [provideHttpClient(withInterceptorsFromDi())]
  }).catch((err) => console.log(err));
}, 0);
