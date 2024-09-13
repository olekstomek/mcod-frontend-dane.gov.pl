import { enableProdMode, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppBrowserModule } from '@app/app.browser.module';
import { environment } from '@env/environment';

if (environment.production) {
  enableProdMode();
} else {
  console.log('Development mode');
}

document.addEventListener('DOMContentLoaded', () => {
  platformBrowserDynamic()
    .bootstrapModule(AppBrowserModule, { defaultEncapsulation: ViewEncapsulation.None })
    .catch(err => console.error(err));
});
