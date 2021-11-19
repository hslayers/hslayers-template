import {BrowserModule} from '@angular/platform-browser';
import {NgModule} from '@angular/core';

import {HslayersAppComponent} from './app.component';
import {HslayersModule} from 'hslayers-ng';

@NgModule({
  declarations: [HslayersAppComponent],
  imports: [BrowserModule, HslayersModule],
  providers: [],
  bootstrap: [HslayersAppComponent],
})
export class AppModule {}
