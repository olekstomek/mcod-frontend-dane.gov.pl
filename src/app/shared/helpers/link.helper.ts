/**
 * Helper class for generating and triggering download link
 */
export class LinkHelper {
    /**
     * Generate element `<a href="">` with download attribute and trigger click event
     *
     * @example
     * LinkHelper.downloadFile('http://media.dane.gov.pl/data.xls')
     *
     * @param sUrl
     * @returns {boolean}
     */
    static downloadFile(sUrl) {
        const hasDownloadAttribute = ('download' in document.createElement('a'));

        if (/(iP)/g.test(navigator.userAgent)) {
            console.log('Your device does not support files downloading. Please try again in desktop browser.');
            window.open(sUrl, '_blank');
            return false;
        }

        if (hasDownloadAttribute) {
            //Creating new link node.
            const link = document.createElement('a');
            link.href = sUrl;
            link.target = '_blank';

            link.download = sUrl.substring(sUrl.lastIndexOf('/') + 1, sUrl.length);
            //Dispatching click event.
            if (document.createEvent) {
                const e = document.createEvent('MouseEvents');
                e.initEvent('click', true, true);
                link.dispatchEvent(e);
                return true;
            }
        }
        if (sUrl.indexOf('?') === -1) {
            sUrl += '?download';
        }

        window.open(sUrl, '_blank');
        return true;
    }

    /**
     * Parses query parameters from given url and returns as object.
     *
     * @example
     * LinkHelper.parseQueryString('?page=1&per_page=5&q=&sort=-title')
     * // returns: {page: 1, per_page: 5, sort: '-title', q: ''}
     *
     * @param str
     * @returns {any}
     */
    static parseQueryString(str = null) {
        return (str || document.location.search).replace(/(^\?)/, '').split('&').map(function (n) {
            return n = n.split('='), this[n[0]] = decodeURIComponent(n[1]), this;
        }.bind({}))[0];
    }
}

