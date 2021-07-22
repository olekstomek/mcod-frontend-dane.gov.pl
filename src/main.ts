import { enableProdMode, ViewEncapsulation } from '@angular/core';
import { platformBrowserDynamic } from '@angular/platform-browser-dynamic';
import { AppBrowserModule } from '@app/app.browser.module';

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

    const s2 = document.createElement('script');
    // tslint:disable-next-line:max-line-length
    const googleFunc = '(function(i, s, o, g, r, a, m){i[\'GoogleAnalyticsObject\'] = r;i[r] = i[r] || function() {(i[r].q = i[r].q ||[]).push(arguments)}, i[r].l = 1 * new Date();a = s.createElement(o),m = s.getElementsByTagName(o)[0];a.async =1;a.src = g;m.parentNode.insertBefore(a, m)})(window, document, \'script\', \'https://www.google-analytics.com/analytics.js\', \'ga\');ga(\'create\', \'' + APP_CONFIG.gaTag + '\', \'auto\');';
    s2.text = googleFunc;
    document.head.appendChild(s2);


    window.dataLayer = window.dataLayer || [];

    gtag('js', new Date());

    gtag('config', APP_CONFIG.gaTag);

}

document.addEventListener('DOMContentLoaded', () => {
    platformBrowserDynamic().bootstrapModule(AppBrowserModule, {defaultEncapsulation: ViewEncapsulation.None})
        .catch(err => console.error(err));
});
