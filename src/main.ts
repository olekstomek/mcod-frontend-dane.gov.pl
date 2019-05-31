import { enableProdMode, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';

import { AppModule } from '@app/app.module';
import { APP_CONFIG } from '@app/app.config';
import { environment } from '@env/environment';

if (environment.production) {
    enableProdMode();
} else {
    console.log('Development mode');
}

declare global {
    interface Window {
        dataLayer: any;
    }
}

function gtag(setting, value) {
    window.dataLayer.push(arguments);
}

if (document.location.hostname.replace('www.', '') === APP_CONFIG.domain) {

    const url = 'https://www.googletagmanager.com/gtag/js?id=' + APP_CONFIG.gaTag;
    const s = document.createElement('script');
    s.setAttribute('src', url);
    s.setAttribute('async', '');
    document.body.appendChild(s);

    window.dataLayer = window.dataLayer || [];

    gtag('js', new Date());

    gtag('config', APP_CONFIG.gaTag);

}

platformBrowserDynamic().bootstrapModule(AppModule, {defaultEncapsulation: ViewEncapsulation.None})
    .catch(err => console.log(err));
