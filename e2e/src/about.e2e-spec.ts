import { AppPage } from './app.po';

describe('About Page', () => {
    let page: AppPage;

    beforeEach(() => {
        page = new AppPage();
        page.navigateTo();
        page.setRodoStorage();
    });

    describe('About Page', () => {
        beforeEach(() => {
            page.navigateTo('/about?acceptRodo=1');
        });

        it('should display page title', function () {
            page.getPageTitle().then(title => {
                expect(title).toEqual('O serwisie - Otwarte Dane');
            });
        });

        it('should display header', () => {
            page.getParagraphText().then(text => {
                expect(text).toEqual('O serwisie');
            });
        });
    });
});
