import {Component, Input, OnDestroy, OnInit} from '@angular/core';
import {BehaviorSubject, Subscription} from 'rxjs';
import {CmsService} from '@app/services/cms.service';
import {SeoService} from '@app/services/seo.service';
import {Router} from '@angular/router';
import {IPageCms} from '@app/services/models/cms/page-cms';


/**
 * CMS static page component
 */
@Component({
    selector: 'app-cms-static-page',
    templateUrl: './cms-static-page.component.html',
})
export class CmsStaticPageComponent implements OnInit, OnDestroy {

    /**
     * Static page slug, must be identical as in CMS system
     */
    @Input() requestedUrl: string;

    /**
     * Requested page language
     */
    @Input() language: string;

    /**
     * Requested revision of page
     */
    @Input() revision: string;

    /**
     * Page Header Display flag
     */
    @Input() displayPageHeader = true;

    /**
     * Page title
     */
    pageTitle: string;

    /**
     * Page subscription
     */
    pageDataSubscription: Subscription;

    /**
     * Page widget
     */
    pageWidget = new BehaviorSubject(null);


    constructor(private cmsService: CmsService,
                private seoService: SeoService,
                public router: Router) {
    }

    /**
     * Get page data
     */
    ngOnInit() {
        this.pageDataSubscription = this.cmsService.getSimplePage(this.requestedUrl, this.language, this.revision).subscribe(
            (page: IPageCms) => {
                this.pageTitle = page.title;
                this.pageWidget.next([page]);
                const seoTitle = (page.meta && page.meta.seo_title) ? page.meta.seo_title : this.pageTitle;
                const seoDescription = (page.meta && page.meta.search_description) ? page.meta.search_description : '';
                this.setSEO(seoTitle, seoDescription);
            },
            err => {
                this.cmsService.displayCmsErrorMessage(this.requestedUrl, err.message);
                this.router.navigate(['/']);
            }
        );
    }

    /**
     * Add SEO metadata
     */
    setSEO(title: string, description: string) {
        this.seoService.setPageTitle(title);
        this.seoService.setDescriptionFromText(description);
    }

    /**
     * Removes page subscription
     */
    ngOnDestroy() {
        this.pageDataSubscription.unsubscribe();
    }
}
