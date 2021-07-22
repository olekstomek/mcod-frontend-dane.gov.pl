export const APP_CONFIG = {
    name: 'Otwarte Dane',
    dateTime: 'D MMMM YYYY, HH:mm',
    domain: 'dane.gov.pl',
    gaTag: 'UA-126920162-1',
    availableLanguages: ['pl', 'en'],
    searchInputMaxLength: 1000,
    csrfCookieName: 'mcod_csrf_token',
    csrfToken: 'X-Mcod-Csrf-Token',
    statsHighContrastEventName: 'theme_changed',
    urls: {
        adminPanelDev: 'http://admin.dev.dane.gov.pl',
        forumInt: 'http://forum.int.dane.gov.pl',
        doc: 'https://api.dane.gov.pl/doc',
        flags: {
            features: 'https://flags.dane.gov.pl/api/client/features',
            register: 'https://flags.dane.gov.pl/api/client/register'
        },
        gitlab: 'https://gitlab.dane.gov.pl/otwarte-dane',
        gov: 'https://www.gov.pl',
        apm: 'https://apm.dane.gov.pl',
        stats: '/pn-apps/stats/'
    },
    contactEmail: 'kontakt@dane.gov.pl'
};
